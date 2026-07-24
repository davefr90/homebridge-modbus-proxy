import { ManagedDevice } from './ManagedDevice.js';

/**
 * Stores and manages configured Modbus devices.
 *
 * The DeviceManager acts as the central registry for all
 * configured devices.
 */
export class DeviceManager {
  /**
   * All configured devices indexed by their unique id.
   */
  private readonly devices =
    new Map<string, ManagedDevice>();

  /**
   * Adds a new device.
   *
   * @throws Error if the id already exists.
   */
  public addDevice(
    device: ManagedDevice,
  ): void {
    if (
      this.devices.has(
        device.id,
      )
    ) {
      throw new Error(
        `Device '${device.id}' already exists.`,
      );
    }

    this.devices.set(
      device.id,
      device,
    );
  }

  /**
   * Removes a device.
   *
   * @returns true if the device existed.
   */
  public removeDevice(
    id: string,
  ): boolean {
    return this.devices.delete(
      id,
    );
  }

  /**
   * Returns a device by id.
   */
  public getDevice(
    id: string,
  ): ManagedDevice | undefined {
    return this.devices.get(
      id,
    );
  }

  /**
   * Returns every configured device.
   */
  public getDevices(): readonly ManagedDevice[] {
    return [
      ...this.devices.values(),
    ];
  }

  /**
   * Returns the number of configured devices.
   */
  public get size(): number {
    return this.devices.size;
  }

  /**
   * Removes every configured device.
   */
  public clear(): void {
    this.devices.clear();
  }
}