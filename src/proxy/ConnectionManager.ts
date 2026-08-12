import { ModbusClient } from '../client/ModbusClient.js';
import { Logger } from '../logging/Logger.js';
import { NullLogger } from '../logging/NullLogger.js';
import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ManagedDeviceRuntime } from './ManagedDeviceRuntime.js';

/**
 * Manages the Modbus TCP connection and runtime state
 * of a single configured device.
 */
export class ConnectionManager {
  private static readonly initialReconnectDelayMs =
    250;

  private static readonly maximumReconnectDelayMs =
    5000;

  private readonly client: ModbusClient;

  private readonly logger: Logger;

  private reconnectTimer?:
    ReturnType<typeof setTimeout>;

  private reconnectInProgress = false;

  private manualDisconnect = false;

  private currentReconnectDelayMs =
    ConnectionManager.initialReconnectDelayMs;

  private requestQueue:
    Promise<void> =
      Promise.resolve();

  /**
   * Creates a new connection manager.
   *
   * A client and logger can optionally be injected
   * for tests or platform-specific integrations.
   */
  public constructor(
    private readonly runtime: ManagedDeviceRuntime,
    client?: ModbusClient,
    logger?: Logger,
  ) {
    this.client =
      client ??
      new ModbusClient(
        runtime.device.host,
        runtime.device.port,
      );

    this.logger =
      logger ??
      new NullLogger();

    this.client.onDisconnected(
      (error) => {
        this.handleDisconnected(
          error,
        );
      },
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
   * Serializes raw proxy requests across all downstream TCP
   * sessions so the target device receives only one request
   * at a time.
   */
  public executeFrame(
    frame: ModbusTcpFrame,
  ): Promise<ModbusTcpFrame> {

    const operation =
      this.requestQueue
        .then(
          () => {
            if (!this.isConnected()) {
              throw new Error(
                'Target Modbus connection is not available.',
              );
            }

            return this.client
              .executeFrame(
                frame,
              );
          },
        );

    this.requestQueue =
      operation.then(
        () => undefined,
        () => undefined,
      );

    return operation;

  }

  /**
   * Opens the connection to the configured Modbus device.
   */
  public async connect(): Promise<void> {
    this.manualDisconnect = false;
    this.clearReconnectTimer();

    this.logger.debug(
      `${this.getLogPrefix()} Connecting to ${this.runtime.device.host}:${this.runtime.device.port}.`,
    );

    try {
      await this.client.connect();

      const connectedAt =
        new Date();

      this.runtime.connected = true;
      this.runtime.lastSeen =
        connectedAt;
      this.runtime.lastConnected =
        connectedAt;
      this.runtime.offlineSince =
        undefined;
      this.runtime.lastError =
        undefined;
      this.runtime.reconnectAttempts =
        0;

      this.currentReconnectDelayMs =
        ConnectionManager.initialReconnectDelayMs;

      this.logger.info(
        `${this.getLogPrefix()} Connected.`,
      );
    } catch (error) {
      const connectionError =
        this.toError(error);

      const disconnectedAt =
        new Date();

      this.runtime.connected = false;
      this.runtime.lastDisconnected =
        disconnectedAt;
      this.runtime.offlineSince ??=
        disconnectedAt;
      this.runtime.lastError =
        connectionError;

      this.logger.error(
        `${this.getLogPrefix()} Connection failed.`,
        connectionError,
      );

      throw connectionError;
    }
  }

  /**
   * Closes the connection to the configured Modbus device.
   *
   * Automatic reconnect attempts are stopped.
   */
  public disconnect(
    error?: Error,
  ): void {
    this.manualDisconnect = true;
    this.clearReconnectTimer();

    this.client.disconnect();

    if (this.runtime.connected) {
      const disconnectedAt =
        new Date();

      this.runtime.lastDisconnected =
        disconnectedAt;
      this.runtime.offlineSince ??=
        disconnectedAt;
    }

    this.runtime.connected = false;
    this.runtime.reconnectAttempts =
      0;

    this.currentReconnectDelayMs =
      ConnectionManager.initialReconnectDelayMs;

    if (error !== undefined) {
      this.runtime.lastError =
        error;

      this.logger.warn(
        `${this.getLogPrefix()} Disconnected manually: ${error.message}`,
      );

      return;
    }

    this.logger.info(
      `${this.getLogPrefix()} Disconnected manually.`,
    );
  }

  /**
   * Updates the runtime state after an unexpected
   * connection loss and schedules a reconnect attempt.
   */
  private handleDisconnected(
    error?: Error,
  ): void {
    const wasConnected =
      this.runtime.connected;

    this.runtime.connected = false;

    if (wasConnected) {
      const disconnectedAt =
        new Date();

      this.runtime.lastDisconnected =
        disconnectedAt;
      this.runtime.offlineSince ??=
        disconnectedAt;
    }

    if (error !== undefined) {
      this.runtime.lastError =
        error;

      this.logger.warn(
        `${this.getLogPrefix()} Connection lost: ${error.message}`,
      );
    } else {
      this.logger.warn(
        `${this.getLogPrefix()} Connection lost.`,
      );
    }

    if (this.manualDisconnect) {
      return;
    }

    this.scheduleReconnect();
  }

  /**
   * Schedules one reconnect attempt.
   *
   * Only one timer or active reconnect attempt is
   * permitted at a time.
   */
  private scheduleReconnect(): void {
    if (
      this.manualDisconnect ||
      this.reconnectTimer !== undefined ||
      this.reconnectInProgress
    ) {
      return;
    }

    const delay =
      this.currentReconnectDelayMs;

    const nextAttempt =
      this.runtime.reconnectAttempts +
      1;

    this.logger.info(
      `${this.getLogPrefix()} Reconnect attempt ${nextAttempt} scheduled in ${delay} ms.`,
    );

    this.reconnectTimer =
      setTimeout(
        () => {
          this.reconnectTimer =
            undefined;

          void this.attemptReconnect();
        },
        delay,
      );

    this.currentReconnectDelayMs =
      Math.min(
        this.currentReconnectDelayMs *
          2,
        ConnectionManager.maximumReconnectDelayMs,
      );
  }

  /**
   * Attempts to reconnect to the configured device.
   *
   * Failed attempts schedule another retry.
   */
  private async attemptReconnect():
    Promise<void> {
    if (
      this.manualDisconnect ||
      this.reconnectInProgress
    ) {
      return;
    }

    this.reconnectInProgress = true;
    this.runtime.reconnectAttempts +=
      1;

    const attemptNumber =
      this.runtime.reconnectAttempts;

    let retryRequired = false;

    this.logger.debug(
      `${this.getLogPrefix()} Starting reconnect attempt ${attemptNumber}.`,
    );

    try {
      /*
       * Clear any stale socket state left behind by the
       * unexpectedly closed connection.
       */
      this.client.disconnect();

      if (this.manualDisconnect) {
        return;
      }

      await this.client.connect();

      /*
       * A manual disconnect may have occurred while the
       * asynchronous connection attempt was running.
       */
      if (this.manualDisconnect) {
        this.client.disconnect();
        return;
      }

      const connectedAt =
        new Date();

      this.runtime.connected = true;
      this.runtime.lastSeen =
        connectedAt;
      this.runtime.lastConnected =
        connectedAt;
      this.runtime.offlineSince =
        undefined;
      this.runtime.lastError =
        undefined;
      this.runtime.successfulReconnects +=
        1;
      this.runtime.reconnectAttempts =
        0;

      this.currentReconnectDelayMs =
        ConnectionManager.initialReconnectDelayMs;

      this.logger.info(
        `${this.getLogPrefix()} Reconnect attempt ${attemptNumber} succeeded.`,
      );
    } catch (error) {
      const reconnectError =
        this.toError(error);

      this.runtime.connected = false;
      this.runtime.lastError =
        reconnectError;
      this.runtime.totalReconnectFailures +=
        1;

      retryRequired = true;

      this.logger.warn(
        `${this.getLogPrefix()} Reconnect attempt ${attemptNumber} failed: ${reconnectError.message}`,
      );
    } finally {
      this.reconnectInProgress = false;
    }

    if (retryRequired) {
      this.scheduleReconnect();
    }
  }

  /**
   * Cancels a scheduled reconnect attempt.
   */
  private clearReconnectTimer(): void {
    if (
      this.reconnectTimer === undefined
    ) {
      return;
    }

    clearTimeout(
      this.reconnectTimer,
    );

    this.reconnectTimer =
      undefined;
  }

  /**
   * Returns a consistent device-specific log prefix.
   */
  private getLogPrefix(): string {
    return `[Device ${this.runtime.device.name}]`;
  }

  /**
   * Converts an unknown thrown value into an Error.
   */
  private toError(
    error: unknown,
  ): Error {
    return error instanceof Error
      ? error
      : new Error(
        String(error),
      );
  }
}
