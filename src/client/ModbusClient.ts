import { TcpConnection } from '../network/TcpConnection.js';
import { ModbusRequestMapper } from '../protocol/ModbusRequestMapper.js';
import { ModbusTcpEncoder } from '../protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ModbusRequest } from './ModbusRequest.js';
import { PendingRequest } from './PendingRequest.js';
import { ReadHoldingRegistersRequest } from './requests/ReadHoldingRegistersRequest.js';
import { ReadInputRegistersRequest } from './requests/ReadInputRegistersRequest.js';
import { WriteMultipleRegistersRequest } from './requests/WriteMultipleRegistersRequest.js';
import { WriteSingleRegisterRequest } from './requests/WriteSingleRegisterRequest.js';
import { ReadHoldingRegistersResponseParser } from './responses/ReadHoldingRegistersResponseParser.js';
import { ReadInputRegistersResponseParser } from './responses/ReadInputRegistersResponseParser.js';
import { WriteMultipleRegistersResponseParser } from './responses/WriteMultipleRegistersResponseParser.js';
import { WriteSingleRegisterResponseParser } from './responses/WriteSingleRegisterResponseParser.js';
import { TransactionManager } from './TransactionManager.js';

/**
 * Modbus TCP client.
 */
export class ModbusClient {
  private readonly connection: TcpConnection;
  private readonly transactionManager: TransactionManager;
  private readonly pendingRequests = new Map<number, PendingRequest>();

  private readonly host: string;
  private readonly port: number;

  public constructor(
    host: string,
    port = 502,
  ) {
    this.host = host;
    this.port = port;

    this.connection = new TcpConnection();
    this.transactionManager = new TransactionManager();

    this.connection.onFrame((frame) => {
      this.handleFrame(frame);
    });

    this.connection.onError((error) => {
      this.handleConnectionError(error);
    });

    this.connection.onClose(() => {
      this.handleConnectionClose();
    });
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

    for (const pendingRequest of this.pendingRequests.values()) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
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
    const request = ReadHoldingRegistersRequest.create(
      unitId,
      address,
      quantity,
    );

    const frame = await this.sendRequest(request);

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
    const request = ReadInputRegistersRequest.create(
      unitId,
      address,
      quantity,
    );

    const frame = await this.sendRequest(request);

    return ReadInputRegistersResponseParser.parse(
      frame,
      quantity,
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
    const request = WriteSingleRegisterRequest.create(
      unitId,
      address,
      value,
    );

    const frame = await this.sendRequest(request);

    WriteSingleRegisterResponseParser.parse(
      frame,
      address,
      value,
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
    const request = WriteMultipleRegistersRequest.create(
      unitId,
      address,
      values,
    );

    const frame = await this.sendRequest(request);

    WriteMultipleRegistersResponseParser.parse(
      frame,
      address,
      values.length,
    );
  }

  /**
   * Sends a Modbus request and waits for the response with the matching
   * transaction identifier.
   */
  private sendRequest(
    request: ModbusRequest,
  ): Promise<ModbusTcpFrame> {
    const transactionId = this.transactionManager.next();

    return new Promise<ModbusTcpFrame>((resolve, reject) => {
      const pendingRequest = new PendingRequest(
        transactionId,
        resolve,
        reject,
      );

      this.pendingRequests.set(
        transactionId,
        pendingRequest,
      );

      try {
        const frame = ModbusRequestMapper.toFrame(
          transactionId,
          request,
        );

        const buffer = ModbusTcpEncoder.encode(frame);

        this.connection.send(buffer);
      } catch (error) {
        this.pendingRequests.delete(transactionId);

        reject(
          error instanceof Error
            ? error
            : new Error(String(error)),
        );
      }
    });
  }

  /**
   * Resolves the pending request that belongs to the received
   * transaction identifier.
   */
  private handleFrame(frame: ModbusTcpFrame): void {
    const pendingRequest = this.pendingRequests.get(
      frame.transactionId,
    );

    if (pendingRequest === undefined) {
      return;
    }

    this.pendingRequests.delete(frame.transactionId);

    pendingRequest.resolve(frame);
  }

  /**
   * Rejects all pending requests after a TCP connection error.
   */
  private handleConnectionError(error: Error): void {
    for (const pendingRequest of this.pendingRequests.values()) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }

  /**
   * Rejects all pending requests when the TCP connection closes.
   */
  private handleConnectionClose(): void {
    if (this.pendingRequests.size === 0) {
      return;
    }

    const error = new Error(
      'Modbus connection closed before a response was received.',
    );

    for (const pendingRequest of this.pendingRequests.values()) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }
}
