import { ManagedDevice } from './ManagedDevice.js';

/**
 * Represents the runtime state of a managed Modbus device.
 *
 * This class stores connection and health information
 * separately from the static device configuration.
 */
export class ManagedDeviceRuntime {
  /**
   * Creates a new runtime instance.
   */
  public constructor(
    public readonly device: ManagedDevice,
  ) {}

  /**
   * Indicates whether the device is currently connected.
   */
  public connected = false;

  /**
   * Timestamp of the last successful communication.
   */
  public lastSeen?: Date;

  /**
   * Timestamp of the last successful connection.
   */
  public lastConnected?: Date;

  /**
   * Timestamp of the most recent connection loss.
   */
  public lastDisconnected?: Date;

  /**
   * Timestamp from which the device has continuously
   * been offline.
   *
   * This value is cleared after a successful connection.
   */
  public offlineSince?: Date;

  /**
   * Last connection or communication error.
   */
  public lastError?: Error;

  /**
   * Number of reconnect attempts made since the most
   * recent successful connection.
   */
  public reconnectAttempts = 0;

  /**
   * Total number of successful automatic reconnects.
   */
  public successfulReconnects = 0;

  /**
   * Total number of failed automatic reconnect attempts.
   */
  public totalReconnectFailures = 0;
}