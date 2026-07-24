import { ModbusException } from '../exceptions/ModbusException.js';
import { TcpConnection } from '../network/TcpConnection.js';
import { ModbusExceptionCode } from '../protocol/ModbusExceptionCode.js';
import { ModbusRequestMapper } from '../protocol/ModbusRequestMapper.js';
import { ModbusTcpEncoder } from '../protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ModbusRequest } from './ModbusRequest.js';
import { PendingRequest } from './PendingRequest.js';
import { ReadCoilsRequest } from './requests/ReadCoilsRequest.js';
import { ReadHoldingRegistersRequest } from './requests/ReadHoldingRegistersRequest.js';
import { ReadInputRegistersRequest } from './requests/ReadInputRegistersRequest.js';
import { WriteMultipleRegistersRequest } from './requests/WriteMultipleRegistersRequest.js';
import { WriteMultipleCoilsRequest } from './requests/WriteMultipleCoilsRequest.js';
import { WriteSingleRegisterRequest } from './requests/WriteSingleRegisterRequest.js';
import { ReadCoilsResponseParser } from './responses/ReadCoilsResponseParser.js';
import { ReadDiscreteInputsResponseParser } from './responses/ReadDiscreteInputsResponseParser.js';
import { ReadDiscreteInputsRequest } from './requests/ReadDiscreteInputsRequest.js';
import { ReadHoldingRegistersResponseParser } from './responses/ReadHoldingRegistersResponseParser.js';
import { ReadInputRegistersResponseParser } from './responses/ReadInputRegistersResponseParser.js';
import { WriteMultipleRegistersResponseParser } from './responses/WriteMultipleRegistersResponseParser.js';
import { WriteMultipleCoilsResponseParser } from './responses/WriteMultipleCoilsResponseParser.js';
import { WriteSingleRegisterResponseParser } from './responses/WriteSingleRegisterResponseParser.js';
import { TransactionManager } from './TransactionManager.js';
import { WriteSingleCoilRequest } from './requests/WriteSingleCoilRequest.js';
import { WriteSingleCoilResponseParser } from './responses/WriteSingleCoilResponseParser.js';
/**
 * Modbus TCP client.
 */
export class ModbusClient {
  private readonly connection: TcpConnection;
  private readonly transactionManager: TransactionManager;
  private readonly pendingRequests =
    new Map<number, PendingRequest>();

  private readonly host: string;
  private readonly port: number;

  public constructor(
    host: string,
    port = 502,
  ) {
    this.host = host;
    this.port = port;

    this.connection = new TcpConnection();
    this.transactionManager =
      new TransactionManager();

    this.connection.onFrame(
      (frame) => {
        this.handleFrame(frame);
      },
    );

    this.connection.onError(
      (error) => {
        this.handleConnectionError(error);
      },
    );

    this.connection.onClose(
      () => {
        this.handleConnectionClose();
      },
    );
  }

    /**
   * Returns whether the TCP connection is currently open.
   */
  public get isConnected(): boolean {
    return this.connection.isConnected;
  }

  /**
   * Opens the TCP connection to the Modbus server.
   */
  public async connect(): Promise<void> {
    await this.connection.connect(
      this.host,
      this.port,
    );
  }

  /**
   * Closes the TCP connection.
   */
  public disconnect(): void {
    this.connection.disconnect();
    this.transactionManager.reset();

    const error = new Error(
      'Modbus connection was closed.',
    );

    for (
      const pendingRequest
      of this.pendingRequests.values()
    ) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }

  /**
   * Reads coils using Modbus function code 0x01.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start coil address.
   * @param quantity Number of coils to read.
   * @returns The decoded coil values.
   */
  public async readCoils(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<boolean[]> {
    const request =
      ReadCoilsRequest.create(
        unitId,
        address,
        quantity,
      );

    const frame =
      await this.sendRequest(request);

    return ReadCoilsResponseParser.parse(
      frame,
      quantity,
    );
  }
    /**
   * Reads discrete inputs using Modbus function code 0x02.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start discrete input address.
   * @param quantity Number of discrete inputs to read.
   * @returns The decoded discrete input values.
   */
  public async readDiscreteInputs(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<boolean[]> {
    const request =
      ReadDiscreteInputsRequest.create(
        unitId,
        address,
        quantity,
      );

    const frame =
      await this.sendRequest(request);

    return ReadDiscreteInputsResponseParser.parse(
      frame,
      quantity,
    );
  }
  /**
   * Reads holding registers using Modbus function code 0x03.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start register address.
   * @param quantity Number of registers to read.
   * @returns The decoded unsigned 16-bit register values.
   */
  public async readHoldingRegisters(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<number[]> {
    const request =
      ReadHoldingRegistersRequest.create(
        unitId,
        address,
        quantity,
      );

    const frame =
      await this.sendRequest(request);

    return ReadHoldingRegistersResponseParser.parse(
      frame,
      quantity,
    );
  }

  /**
   * Reads input registers using Modbus function code 0x04.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start register address.
   * @param quantity Number of registers to read.
   * @returns The decoded unsigned 16-bit register values.
   */
  public async readInputRegisters(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<number[]> {
    const request =
      ReadInputRegistersRequest.create(
        unitId,
        address,
        quantity,
      );

    const frame =
      await this.sendRequest(request);

    return ReadInputRegistersResponseParser.parse(
      frame,
      quantity,
    );
  }

  /**
   * Writes a single coil using Modbus function code 0x05.
   *
   * @param unitId Modbus unit identifier.
   * @param address Coil address.
   * @param value Coil value.
   */
  public async writeSingleCoil(
    unitId: number,
    address: number,
    value: boolean,
  ): Promise<void> {
    const request =
      WriteSingleCoilRequest.create(
        unitId,
        address,
        value,
      );

    const frame =
      await this.sendRequest(request);

    WriteSingleCoilResponseParser.parse(
      frame,
      address,
      value,
    );
  }

  /**
   * Writes one register using Modbus function code 0x06.
   *
   * @param unitId Modbus unit identifier.
   * @param address Register address.
   * @param value Unsigned 16-bit register value.
   */
  public async writeSingleRegister(
    unitId: number,
    address: number,
    value: number,
  ): Promise<void> {
    const request =
      WriteSingleRegisterRequest.create(
        unitId,
        address,
        value,
      );

    const frame =
      await this.sendRequest(request);

    WriteSingleRegisterResponseParser.parse(
      frame,
      address,
      value,
    );
  }
    /**
   * Writes multiple coils using Modbus function code 0x0F.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start coil address.
   * @param values Coil values.
   */
  public async writeMultipleCoils(
    unitId: number,
    address: number,
    values: boolean[],
  ): Promise<void> {
    const request =
      WriteMultipleCoilsRequest.create(
        unitId,
        address,
        values,
      );

    const frame =
      await this.sendRequest(request);

    WriteMultipleCoilsResponseParser.parse(
      frame,
      address,
      values.length,
    );
  }
  /**
   * Writes multiple registers using Modbus function code 0x10.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start register address.
   * @param values Unsigned 16-bit register values.
   */
  public async writeMultipleRegisters(
    unitId: number,
    address: number,
    values: number[],
  ): Promise<void> {
    const request =
      WriteMultipleRegistersRequest.create(
        unitId,
        address,
        values,
      );

    const frame =
      await this.sendRequest(request);

    WriteMultipleRegistersResponseParser.parse(
      frame,
      address,
      values.length,
    );
  }

    /**
   * Executes a raw Modbus TCP frame.
   *
   * The incoming transaction identifier is preserved for
   * the returned response. Internally, the client uses its
   * own transaction identifier to avoid collisions between
   * multiple proxy clients.
   *
   * Modbus exception responses are returned unchanged so
   * that a proxy client receives the original protocol
   * response from the target device.
   */
  public async executeFrame(
    frame: ModbusTcpFrame,
  ): Promise<ModbusTcpFrame> {
    const originalTransactionId =
      frame.transactionId;

    const internalTransactionId =
      this.transactionManager.next();

    const outboundFrame =
      new ModbusTcpFrame(
        internalTransactionId,
        frame.protocolId,
        frame.unitId,
        frame.functionCode,
        frame.data,
      );

    const response =
      await this.sendFrame(
        outboundFrame,
        true,
      );

    return new ModbusTcpFrame(
      originalTransactionId,
      response.protocolId,
      response.unitId,
      response.functionCode,
      response.data,
    );
  }
      /**
   * Maps and sends a high-level Modbus request.
   */
  private sendRequest(
    request: ModbusRequest,
  ): Promise<ModbusTcpFrame> {
    const transactionId =
      this.transactionManager.next();

    const frame =
      ModbusRequestMapper.toFrame(
        transactionId,
        request,
      );

    return this.sendFrame(
      frame,
      false,
    );
  }

  /**
   * Sends a Modbus TCP frame and waits for the response
   * with the matching internal transaction identifier.
   */
  private sendFrame(
    frame: ModbusTcpFrame,
    resolveExceptionResponses: boolean,
  ): Promise<ModbusTcpFrame> {
    const transactionId =
      frame.transactionId;

    return new Promise<ModbusTcpFrame>(
      (
        resolve,
        reject,
      ) => {
        const pendingRequest =
          new PendingRequest(
            transactionId,
            resolve,
            reject,
            resolveExceptionResponses,
          );

        this.pendingRequests.set(
          transactionId,
          pendingRequest,
        );

        try {
          const buffer =
            ModbusTcpEncoder.encode(frame);

          void this.connection
            .send(buffer)
            .catch((error: unknown) => {
              /*
               * The request may already have been completed
               * before the send callback reports its result.
               */
              if (
                this.pendingRequests.get(
                  transactionId,
                ) !== pendingRequest
              ) {
                return;
              }

              this.pendingRequests.delete(
                transactionId,
              );

              pendingRequest.reject(
                error instanceof Error
                  ? error
                  : new Error(
                      String(error),
                    ),
              );
            });
        } catch (error) {
          this.pendingRequests.delete(
            transactionId,
          );

          pendingRequest.reject(
            error instanceof Error
              ? error
              : new Error(
                  String(error),
                ),
          );
        }
      },
    );
  }

  /**
   * Resolves or rejects the pending request that belongs
   * to the received transaction identifier.
   */
  private handleFrame(
    frame: ModbusTcpFrame,
  ): void {
    const pendingRequest =
      this.pendingRequests.get(
        frame.transactionId,
      );

    /*
     * Ignore responses for unknown or already completed
     * transaction identifiers.
     */
    if (pendingRequest === undefined) {
      return;
    }

    this.pendingRequests.delete(
      frame.transactionId,
    );

    /*
     * In a Modbus exception response, bit 7 of the
     * function code is set.
     *
     * Examples:
     *
     * 0x01 becomes 0x81
     * 0x03 becomes 0x83
     * 0x04 becomes 0x84
     * 0x06 becomes 0x86
     * 0x10 becomes 0x90
     */
        const isExceptionResponse =
      (frame.functionCode & 0x80) !== 0;

    if (
      !isExceptionResponse ||
      pendingRequest.resolveExceptionResponses
    ) {
      pendingRequest.resolve(frame);
      return;
    }

    /*
     * A valid Modbus exception response contains exactly
     * one data byte: the exception code.
     */
    if (frame.data.length !== 1) {
      pendingRequest.reject(
        new Error(
          'Invalid Modbus exception response: ' +
            `expected 1 data byte, received ${frame.data.length}.`,
        ),
      );

      return;
    }

    /*
     * Remove the exception bit to recover the original
     * request function code.
     */
    const originalFunctionCode =
      frame.functionCode & 0x7f;

    const exceptionCode =
      frame.data.readUInt8(
        0,
      ) as ModbusExceptionCode;

    pendingRequest.reject(
      new ModbusException(
        originalFunctionCode,
        exceptionCode,
      ),
    );
  }

  /**
   * Rejects all pending requests after a TCP
   * connection error.
   */
  private handleConnectionError(
    error: Error,
  ): void {
    for (
      const pendingRequest
      of this.pendingRequests.values()
    ) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }

  /**
   * Rejects all pending requests when the TCP
   * connection closes.
   */
  private handleConnectionClose(): void {
    if (this.pendingRequests.size === 0) {
      return;
    }

    const error = new Error(
      'Modbus connection closed before a response was received.',
    );

    for (
      const pendingRequest
      of this.pendingRequests.values()
    ) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }
}