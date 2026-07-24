import { ManagedDevice } from './ManagedDevice.js';

/**
 * Represents the runtime state of a managed Modbus device.
 *
 * This class stores connection-related information separately
 * from the static device configuration.
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
   * Last communication error.
   */
  public lastError?: Error;
}