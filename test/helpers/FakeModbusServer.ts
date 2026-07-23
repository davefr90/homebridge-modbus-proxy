import net, { Server, Socket } from 'node:net';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpDecoder } from '../../src/protocol/ModbusTcpDecoder.js';
import { ModbusTcpEncoder } from '../../src/protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { RegisterBank } from './RegisterBank.js';

/**
 * Fake Modbus TCP server used for integration tests.
 *
 * Currently supported:
 *
 * - Modbus TCP request reception
 * - Modbus TCP frame decoding
 * - Function Code 0x03: Read Holding Registers
 * - Function Code 0x04: Read Input Registers
 * - Modbus TCP response encoding
 */
export class FakeModbusServer {
  /**
   * Register storage used by the fake server.
   */
  public readonly registers = new RegisterBank();

  /**
   * Node.js TCP server instance.
   */
  private server?: Server;

  /**
   * All currently connected TCP sockets.
   */
  private readonly sockets = new Set<Socket>();

  /**
   * TCP port selected by the operating system.
   *
   * Zero means that the server is not currently running.
   */
  private listeningPort = 0;

  /**
   * Last successfully decoded Modbus TCP frame.
   */
  private lastFrame?: ModbusTcpFrame;

  /**
   * Returns the TCP port on which the server is listening.
   *
   * @throws Error if the server is not running.
   */
  public get port(): number {
    if (this.listeningPort === 0) {
      throw new Error(
        'FakeModbusServer is not running.',
      );
    }

    return this.listeningPort;
  }

  /**
   * Returns the last successfully decoded Modbus TCP frame.
   */
  public getLastFrame(): ModbusTcpFrame | undefined {
    return this.lastFrame;
  }

  /**
   * Starts the fake Modbus TCP server.
   *
   * Port zero instructs the operating system to select
   * an available TCP port automatically.
   */
  public async start(): Promise<void> {
    if (this.server !== undefined) {
      throw new Error(
        'FakeModbusServer is already running.',
      );
    }

    this.server = net.createServer(
      (socket) => {
        this.handleConnection(socket);
      },
    );

    await new Promise<void>((resolve, reject) => {
      const server = this.server;

      if (server === undefined) {
        reject(
          new Error(
            'FakeModbusServer could not be created.',
          ),
        );

        return;
      }

      /**
       * Handles an error that occurs while starting
       * the TCP server.
       */
      const handleStartError = (
        error: Error,
      ): void => {
        server.off(
          'listening',
          handleListening,
        );

        this.server = undefined;

        reject(error);
      };

      /**
       * Handles the successful server start.
       */
      const handleListening = (): void => {
        server.off(
          'error',
          handleStartError,
        );

        const address = server.address();

        if (
          address === null ||
          typeof address === 'string'
        ) {
          this.server = undefined;

          reject(
            new Error(
              'Unable to determine listening port.',
            ),
          );

          return;
        }

        this.listeningPort = address.port;

        resolve();
      };

      server.once(
        'error',
        handleStartError,
      );

      server.once(
        'listening',
        handleListening,
      );

      server.listen(
        0,
        '127.0.0.1',
      );
    });
  }

  /**
   * Stops the fake Modbus TCP server.
   *
   * All client connections, registers and captured frames
   * are cleared so that each test starts with a clean state.
   */
  public async stop(): Promise<void> {
    /*
     * Destroy all currently connected sockets.
     *
     * Otherwise server.close() could wait until the clients
     * close their connections themselves.
     */
    for (const socket of this.sockets) {
      socket.destroy();
    }

    this.sockets.clear();

    const server = this.server;

    /*
     * Reset the server state immediately.
     */
    this.server = undefined;
    this.listeningPort = 0;
    this.lastFrame = undefined;
    this.registers.clear();

    /*
     * Calling stop() while the server is already stopped
     * is allowed.
     */
    if (server === undefined) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      server.close(
        (error) => {
          if (error !== undefined) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  /**
   * Configures a newly connected TCP client.
   */
  private handleConnection(
    socket: Socket,
  ): void {
    /*
     * Keep track of the socket so that it can be destroyed
     * when the test server is stopped.
     */
    this.sockets.add(socket);

    socket.on(
      'close',
      () => {
        this.sockets.delete(socket);
      },
    );

    socket.on(
      'error',
      () => {
        /*
         * Socket errors are intentionally ignored here.
         *
         * Individual integration tests can verify expected
         * connection failures from the client side.
         */
      },
    );

    socket.on(
      'data',
      (data) => {
        this.handleData(
          socket,
          data,
        );
      },
    );
  }

  /**
   * Decodes incoming TCP data as a Modbus TCP frame.
   */
  private handleData(
    socket: Socket,
    data: Buffer,
  ): void {
    try {
      const frame =
        ModbusTcpDecoder.decode(data);

      /*
       * Store the frame for tests that inspect the
       * received request.
       */
      this.lastFrame = frame;

      this.processFrame(
        socket,
        frame,
      );
    } catch {
      /*
       * Malformed or incomplete frames are ignored for now.
       *
       * TCP stream buffering will be implemented separately.
       * One TCP data event is not guaranteed to contain
       * exactly one complete Modbus TCP frame.
       */
    }
  }

  /**
   * Routes a decoded Modbus request to its function handler.
   */
  private processFrame(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    switch (frame.functionCode) {
      case ModbusFunctionCode.ReadHoldingRegisters:
        this.handleReadHoldingRegisters(
          socket,
          frame,
        );

        break;

      case ModbusFunctionCode.ReadInputRegisters:
        this.handleReadInputRegisters(
          socket,
          frame,
        );

        break;

      default:
        /*
         * Additional function codes will be added later:
         *
         * 0x06 Write Single Register
         * 0x10 Write Multiple Registers
         */
        break;
    }
  }

  /**
   * Handles Function Code 0x03:
   * Read Holding Registers.
   *
   * Request data:
   *
   * Byte 0-1: Starting address
   * Byte 2-3: Quantity of registers
   *
   * Response data:
   *
   * Byte 0:   Number of following register-data bytes
   * Byte 1-n: Register values, two bytes per register
   */
  private handleReadHoldingRegisters(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    /*
     * The first two request-data bytes contain the
     * starting register address.
     *
     * Modbus uses Big Endian byte order.
     */
    const startAddress =
      frame.data.readUInt16BE(0);

    /*
     * The next two request-data bytes contain the
     * number of registers requested by the client.
     */
    const quantity =
      frame.data.readUInt16BE(2);

    /*
     * The response-data buffer consists of:
     *
     * 1 byte for the byte count
     * 2 bytes for every requested register
     */
    const responseData =
      Buffer.alloc(
        1 + quantity * 2,
      );

    /*
     * Every Modbus register occupies two bytes.
     *
     * Examples:
     *
     * 1 register  = 2 data bytes
     * 2 registers = 4 data bytes
     * 3 registers = 6 data bytes
     */
    responseData.writeUInt8(
      quantity * 2,
      0,
    );

    /*
     * Read all requested Holding Registers consecutively.
     */
    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const registerAddress =
        startAddress + index;

      const registerValue =
        this.registers.readHoldingRegister(
          registerAddress,
        );

      /*
       * Offset zero contains the byte count.
       *
       * The first register therefore starts at offset one.
       * Every following register begins two bytes later.
       */
      const responseOffset =
        1 + index * 2;

      responseData.writeUInt16BE(
        registerValue,
        responseOffset,
      );
    }

    /*
     * The response must use the same:
     *
     * - Transaction ID
     * - Protocol ID
     * - Unit ID
     *
     * as the original request.
     *
     * The transaction ID allows the client to match the
     * response to its pending request.
     */
    const responseFrame =
      new ModbusTcpFrame(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.ReadHoldingRegisters,
        responseData,
      );

    /*
     * Encoding and sending are handled by a shared helper.
     */
    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Handles Function Code 0x04:
   * Read Input Registers.
   *
   * Request data:
   *
   * Byte 0-1: Starting address
   * Byte 2-3: Quantity of registers
   *
   * Response data:
   *
   * Byte 0:   Number of following register-data bytes
   * Byte 1-n: Register values, two bytes per register
   */
  private handleReadInputRegisters(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    /*
     * The request structure for Function Code 0x04 is
     * identical to Function Code 0x03.
     *
     * The first two data bytes contain the starting address.
     */
    const startAddress =
      frame.data.readUInt16BE(0);

    /*
     * The following two bytes contain the requested
     * number of Input Registers.
     */
    const quantity =
      frame.data.readUInt16BE(2);

    /*
     * The response contains:
     *
     * 1 byte byte-count field
     * 2 bytes for every Input Register
     */
    const responseData =
      Buffer.alloc(
        1 + quantity * 2,
      );

    /*
     * Store the number of register-data bytes.
     *
     * Each register contains exactly two bytes.
     */
    responseData.writeUInt8(
      quantity * 2,
      0,
    );

    /*
     * Read the requested Input Registers consecutively.
     */
    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const registerAddress =
        startAddress + index;

      /*
       * This is the important difference from Function Code 0x03.
       *
       * Function Code 0x04 reads from the Input Register area,
       * not from the Holding Register area.
       */
      const registerValue =
        this.registers.readInputRegister(
          registerAddress,
        );

      /*
       * Offset zero contains the byte count.
       *
       * Register values begin at offset one and each
       * register occupies two bytes.
       */
      const responseOffset =
        1 + index * 2;

      responseData.writeUInt16BE(
        registerValue,
        responseOffset,
      );
    }

    /*
     * Create the complete Modbus TCP response frame.
     *
     * Transaction ID, Protocol ID and Unit ID are copied
     * from the request.
     *
     * The response Function Code remains 0x04.
     */
    const responseFrame =
      new ModbusTcpFrame(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.ReadInputRegisters,
        responseData,
      );

    /*
     * Encode and send the response to the requesting client.
     */
    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Encodes and sends a Modbus TCP frame.
   *
   * This helper keeps response transmission in one place.
   * Every supported function code can reuse this method.
   */
  private sendFrame(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    /*
     * A TCP socket cannot send a ModbusTcpFrame object.
     *
     * The frame must first be converted into its complete
     * binary Modbus TCP representation.
     */
    const responseBuffer =
      ModbusTcpEncoder.encode(
        frame,
      );

    /*
     * Send the encoded response to the client that issued
     * the request.
     */
    socket.write(
      responseBuffer,
    );
  }
}