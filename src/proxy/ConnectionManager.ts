import { ModbusClient } from '../client/ModbusClient.js';
import { ManagedDeviceRuntime } from './ManagedDeviceRuntime.js';

/**
 * Manages the Modbus TCP connection and runtime state
 * of a single configured device.
 */
export class ConnectionManager {
  private readonly client: ModbusClient;

  /**
   * Creates a new connection manager.
   *
   * A client can optionally be injected for tests.
   */
  public constructor(
    private readonly runtime: ManagedDeviceRuntime,
    client?: ModbusClient,
  ) {
    this.client =
      client ??
      new ModbusClient(
        runtime.device.host,
        runtime.device.port,
      );
  }

  /**
   * Returns the managed Modbus client.
   */
  public getClient(): ModbusClient {
    return this.client;
  }

  /**
   * Returns the runtime object.
   */
  public getRuntime(): ManagedDeviceRuntime {
    return this.runtime;
  }

  /**
   * Returns whether the device is currently connected.
   */
  public isConnected(): boolean {
    return this.runtime.connected;
  }

  /**
   * Opens the connection to the configured Modbus device.
   */
  public async connect(): Promise<void> {
    try {
      await this.client.connect();

      this.runtime.connected = true;
      this.runtime.lastSeen = new Date();
      this.runtime.lastError = undefined;
    } catch (error) {
      const connectionError =
        error instanceof Error
          ? error
          : new Error(String(error));

      this.runtime.connected = false;
      this.runtime.lastError =
        connectionError;

      throw connectionError;
    }
  }

  /**
   * Closes the connection to the configured Modbus device.
   */
  public disconnect(error?: Error): void {
    this.client.disconnect();
    this.runtime.connected = false;

    if (error !== undefined) {
      this.runtime.lastError = error;
    }
  }
}