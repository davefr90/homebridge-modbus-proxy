import net, {
  Server,
  Socket,
} from 'node:net';

import { ModbusExceptionCode } from '../../src/protocol/ModbusExceptionCode.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpDecoder } from '../../src/protocol/ModbusTcpDecoder.js';
import { ModbusTcpEncoder } from '../../src/protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { CoilBank } from './CoilBank.js';
import { DiscreteInputBank } from './DiscreteInputBank.js';
import { RegisterBank } from './RegisterBank.js';

/**
 * Fake Modbus TCP server used for integration tests.
 *
 * Currently supported:
 *
 * - Modbus TCP request reception
 * - Modbus TCP frame decoding
 * - Function Code 0x01: Read Coils
 * - Function Code 0x02: Read Discrete Inputs
 * - Function Code 0x03: Read Holding Registers
 * - Function Code 0x04: Read Input Registers
 * - Function Code 0x05: Write Single Coil
 * - Function Code 0x06: Write Single Register
 * - Function Code 0x0F: Write Multiple Coils
 * - Function Code 0x10: Write Multiple Registers
 * - Modbus TCP response encoding
 */
export class FakeModbusServer {
  /**
   * Register storage used by the fake server.
   */
  public readonly registers =
    new RegisterBank();

  /**
   * Coil storage used by the fake server.
   */
  public readonly coils =
    new CoilBank();

  /**
   * Discrete input storage used by the fake server.
   */
  public readonly discreteInputs =
    new DiscreteInputBank();

  /**
   * Node.js TCP server instance.
   */
  private server?: Server;

  /**
   * All currently connected TCP sockets.
   */
  private readonly sockets =
    new Set<Socket>();

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

    await new Promise<void>(
      (
        resolve,
        reject,
      ) => {
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

          this.listeningPort =
            address.port;

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
      },
    );
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

    this.registers.clear();
    this.coils.clear();
    this.discreteInputs.clear();

    this.server = undefined;
    this.listeningPort = 0;
    this.lastFrame = undefined;

    /*
     * Calling stop() while the server is already stopped
     * is allowed.
     */
    if (server === undefined) {
      return;
    }

    await new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        server.close(
          (error) => {
            if (error !== undefined) {
              reject(error);
              return;
            }

            resolve();
          },
        );
      },
    );
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
        const buffer =
          Buffer.from(data);

        this.handleData(
          socket,
          buffer,
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
      case ModbusFunctionCode.ReadCoils:
        this.handleReadCoils(
          socket,
          frame,
        );

        break;

      case ModbusFunctionCode.ReadDiscreteInputs:
        this.handleReadDiscreteInputs(
          socket,
          frame,
        );

        break;

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

      case ModbusFunctionCode.WriteSingleCoil:
        this.handleWriteSingleCoil(
          socket,
          frame,
        );

        break;

      case ModbusFunctionCode.WriteSingleRegister:
        this.handleWriteSingleRegister(
          socket,
          frame,
        );

        break;

      case ModbusFunctionCode.WriteMultipleCoils:
        this.handleWriteMultipleCoils(
          socket,
          frame,
        );

        break;

      case ModbusFunctionCode.WriteMultipleRegisters:
        this.handleWriteMultipleRegisters(
          socket,
          frame,
        );

        break;

      default:
        this.sendException(
          socket,
          frame,
          ModbusExceptionCode.IllegalFunction,
        );

        break;
    }
  }

    /**
   * Handles Function Code 0x01:
   * Read Coils.
   */
  private handleReadCoils(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    this.handleBitRead(
      socket,
      frame,
      ModbusFunctionCode.ReadCoils,
      (address) =>
        this.coils.readCoil(address),
    );
  }

  /**
   * Handles Function Code 0x02:
   * Read Discrete Inputs.
   */
  private handleReadDiscreteInputs(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    this.handleBitRead(
      socket,
      frame,
      ModbusFunctionCode.ReadDiscreteInputs,
      (address) =>
        this.discreteInputs.readInput(address),
    );
  }

  /**
   * Handles Function Code 0x03:
   * Read Holding Registers.
   */
  private handleReadHoldingRegisters(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    this.handleRegisterRead(
      socket,
      frame,
      ModbusFunctionCode.ReadHoldingRegisters,
      (address) =>
        this.registers.readHoldingRegister(
          address,
        ),
    );
  }

  /**
   * Handles Function Code 0x04:
   * Read Input Registers.
   */
  private handleReadInputRegisters(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    this.handleRegisterRead(
      socket,
      frame,
      ModbusFunctionCode.ReadInputRegisters,
      (address) =>
        this.registers.readInputRegister(
          address,
        ),
    );
  }

  /**
   * Handles a Modbus function that reads packed bit values.
   */
  private handleBitRead(
    socket: Socket,
    frame: ModbusTcpFrame,
    functionCode: ModbusFunctionCode,
    readValue: (
      address: number,
    ) => boolean,
  ): void {
    const startAddress =
      frame.data.readUInt16BE(0);

    const quantity =
      frame.data.readUInt16BE(2);

    if (
      !this.isValidRegisterRange(
        startAddress,
        quantity,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    const responseFrame =
      this.createBitReadResponse(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        functionCode,
        startAddress,
        quantity,
        readValue,
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Handles a Modbus function that reads 16-bit registers.
   */
  private handleRegisterRead(
    socket: Socket,
    frame: ModbusTcpFrame,
    functionCode: ModbusFunctionCode,
    readValue: (
      address: number,
    ) => number,
  ): void {
    const startAddress =
      frame.data.readUInt16BE(0);

    const quantity =
      frame.data.readUInt16BE(2);

    if (
      !this.isValidRegisterRange(
        startAddress,
        quantity,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    const values: number[] = [];

    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      values.push(
        readValue(
          startAddress + index,
        ),
      );
    }

    const responseFrame =
      this.createReadResponse(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        functionCode,
        values,
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Creates a response containing packed bit values.
   *
   * Modbus packs the first requested value into bit zero
   * of the first data byte.
   */
  private createBitReadResponse(
    transactionId: number,
    protocolId: number,
    unitId: number,
    functionCode: ModbusFunctionCode,
    startAddress: number,
    quantity: number,
    readValue: (
      address: number,
    ) => boolean,
  ): ModbusTcpFrame {
    const byteCount =
      Math.ceil(quantity / 8);

    const data =
      Buffer.alloc(
        1 + byteCount,
      );

    data.writeUInt8(
      byteCount,
      0,
    );

    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const value =
        readValue(
          startAddress + index,
        );

      if (!value) {
        continue;
      }

      const byteIndex =
        1 + Math.floor(index / 8);

      const bitIndex =
        index % 8;

      data[byteIndex] |=
        1 << bitIndex;
    }

    return new ModbusTcpFrame(
      transactionId,
      protocolId,
      unitId,
      functionCode,
      data,
    );
  }

  /**
   * Handles Function Code 0x05:
   * Write Single Coil.
   */
  private handleWriteSingleCoil(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    const address =
      frame.data.readUInt16BE(0);

    if (
      !this.isValidRegisterRange(
        address,
        1,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    const rawValue =
      frame.data.readUInt16BE(2);

    if (
      rawValue !== 0xff00 &&
      rawValue !== 0x0000
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataValue,
      );

      return;
    }

    this.coils.writeCoil(
      address,
      rawValue === 0xff00,
    );

    const responseFrame =
      new ModbusTcpFrame(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.WriteSingleCoil,
        Buffer.from(frame.data),
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Handles Function Code 0x06:
   * Write Single Register.
   */
  private handleWriteSingleRegister(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    const address =
      frame.data.readUInt16BE(0);

    if (
      !this.isValidRegisterRange(
        address,
        1,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    const value =
      frame.data.readUInt16BE(2);

    this.registers.writeHoldingRegister(
      address,
      value,
    );

    const responseFrame =
      new ModbusTcpFrame(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.WriteSingleRegister,
        Buffer.from(frame.data),
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Handles Function Code 0x0F:
   * Write Multiple Coils.
   */
  private handleWriteMultipleCoils(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    const startAddress =
      frame.data.readUInt16BE(0);

    const quantity =
      frame.data.readUInt16BE(2);

    if (
      !this.isValidRegisterRange(
        startAddress,
        quantity,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    const values: boolean[] = [];

    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const byte =
        frame.data.readUInt8(
          5 + Math.floor(index / 8),
        );

      const bit =
        (byte >> (index % 8)) & 0x01;

      values.push(
        bit === 1,
      );
    }

    this.coils.writeCoils(
      startAddress,
      values,
    );

    const responseFrame =
      this.createWriteMultipleResponse(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.WriteMultipleCoils,
        startAddress,
        quantity,
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Handles Function Code 0x10:
   * Write Multiple Registers.
   */
  private handleWriteMultipleRegisters(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    const startAddress =
      frame.data.readUInt16BE(0);

    const quantity =
      frame.data.readUInt16BE(2);

    if (
      !this.isValidRegisterRange(
        startAddress,
        quantity,
      )
    ) {
      this.sendException(
        socket,
        frame,
        ModbusExceptionCode.IllegalDataAddress,
      );

      return;
    }

    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const value =
        frame.data.readUInt16BE(
          5 + (index * 2),
        );

      this.registers.writeHoldingRegister(
        startAddress + index,
        value,
      );
    }

    const responseFrame =
      this.createWriteMultipleResponse(
        frame.transactionId,
        frame.protocolId,
        frame.unitId,
        ModbusFunctionCode.WriteMultipleRegisters,
        startAddress,
        quantity,
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Creates a register read response.
   */
  private createReadResponse(
    transactionId: number,
    protocolId: number,
    unitId: number,
    functionCode: ModbusFunctionCode,
    values: number[],
  ): ModbusTcpFrame {
    const data =
      Buffer.alloc(
        1 + (values.length * 2),
      );

    data.writeUInt8(
      values.length * 2,
      0,
    );

    values.forEach(
      (
        value,
        index,
      ) => {
        data.writeUInt16BE(
          value,
          1 + (index * 2),
        );
      },
    );

    return new ModbusTcpFrame(
      transactionId,
      protocolId,
      unitId,
      functionCode,
      data,
    );
  }

  /**
   * Creates a successful write-multiple response.
   */
  private createWriteMultipleResponse(
    transactionId: number,
    protocolId: number,
    unitId: number,
    functionCode: ModbusFunctionCode,
    startAddress: number,
    quantity: number,
  ): ModbusTcpFrame {
    const data =
      Buffer.alloc(4);

    data.writeUInt16BE(
      startAddress,
      0,
    );

    data.writeUInt16BE(
      quantity,
      2,
    );

    return new ModbusTcpFrame(
      transactionId,
      protocolId,
      unitId,
      functionCode,
      data,
    );
  }

  /**
   * Returns whether the requested register range is valid.
   */
  private isValidRegisterRange(
    startAddress: number,
    quantity: number,
  ): boolean {
    return (
      quantity > 0 &&
      startAddress + quantity <= 0x1000
    );
  }

  /**
   * Sends a Modbus exception response.
   */
  private sendException(
    socket: Socket,
    request: ModbusTcpFrame,
    exceptionCode: ModbusExceptionCode,
  ): void {
    const responseFrame =
      new ModbusTcpFrame(
        request.transactionId,
        request.protocolId,
        request.unitId,
        (
          request.functionCode |
          0x80
        ) as ModbusFunctionCode,
        Buffer.from([
          exceptionCode,
        ]),
      );

    this.sendFrame(
      socket,
      responseFrame,
    );
  }

  /**
   * Encodes and sends a Modbus TCP frame.
   */
  private sendFrame(
    socket: Socket,
    frame: ModbusTcpFrame,
  ): void {
    const responseBuffer =
      ModbusTcpEncoder.encode(
        frame,
      );

    socket.write(
      responseBuffer,
    );
  }
}