import { ManagedDeviceRuntime } from './ManagedDeviceRuntime.js';

/**
 * Manages the runtime state of a single Modbus device.
 *
 * Network communication is added in later stages.
 */
export class ConnectionManager {
  /**
   * Creates a new connection manager.
   */
  public constructor(
    private readonly runtime: ManagedDeviceRuntime,
  ) {}

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
   * Marks the device as connected.
   */
  public connect(): void {
    this.runtime.connected = true;
    this.runtime.lastSeen = new Date();
    this.runtime.lastError = undefined;
  }

  /**
   * Marks the device as disconnected.
   */
  public disconnect(error?: Error): void {
    this.runtime.connected = false;

    if (error !== undefined) {
      this.runtime.lastError = error;
    }
  }
}