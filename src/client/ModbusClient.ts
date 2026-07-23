import { TcpConnection } from '../network/TcpConnection.js';
import { ModbusRequestMapper } from '../protocol/ModbusRequestMapper.js';
import { ModbusTcpEncoder } from '../protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ModbusRequest } from './ModbusRequest.js';
import { PendingRequest } from './PendingRequest.js';
import { ReadHoldingRegistersRequest } from './requests/ReadHoldingRegistersRequest.js';
import { ReadInputRegistersRequest } from './requests/ReadInputRegistersRequest.js';
import { ReadHoldingRegistersResponseParser } from './responses/ReadHoldingRegistersResponseParser.js';
import { ReadInputRegistersResponseParser } from './responses/ReadInputRegistersResponseParser.js';
import { TransactionManager } from './TransactionManager.js';

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
   * @returns The decoded 16-bit register values.
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
   * @returns The decoded 16-bit register values.
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
   * Sends a Modbus request and waits for the matching response.
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
   * Resolves the pending request matching the transaction ID.
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
   * Rejects all pending requests after a connection error.
   */
  private handleConnectionError(error: Error): void {
    for (const pendingRequest of this.pendingRequests.values()) {
      pendingRequest.reject(error);
    }

    this.pendingRequests.clear();
  }

  /**
   * Rejects all pending requests if the connection closes.
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