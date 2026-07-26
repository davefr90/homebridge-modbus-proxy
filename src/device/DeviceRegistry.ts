import type { DeviceDefinition } from './DeviceDefinition.js';
import type { ManagedDevice } from './ManagedDevice.js';
import type { DeviceFactory } from '../model/DeviceFactory.js';

/**
 * Stores and manages logical devices.
 */
export class DeviceRegistry {

  private readonly devices =
    new Map<string, ManagedDevice>();

  public constructor(
    private readonly factory: DeviceFactory,
  ) {}

  /**
   * Creates and registers a device.
   */
  public register(
    id: string,
    definition: DeviceDefinition,
  ): ManagedDevice {

    if (this.devices.has(id)) {
      throw new Error(
        `Device already registered: ${id}`,
      );
    }

    const device =
      this.factory.create(
        definition,
      );

    this.devices.set(
      id,
      device,
    );

    return device;

  }

  /**
   * Returns a device.
   */
  public get(
    id: string,
  ): ManagedDevice {

    const device =
      this.devices.get(
        id,
      );

    if (device === undefined) {
      throw new Error(
        `Unknown device: ${id}`,
      );
    }

    return device;

  }

  /**
   * Checks whether a device exists.
   */
  public has(
    id: string,
  ): boolean {

    return this.devices.has(
      id,
    );

  }

  /**
   * Removes a device.
   */
  public remove(
    id: string,
  ): boolean {

    return this.devices.delete(
      id,
    );

  }

  /**
   * Returns all device ids.
   */
  public ids(): string[] {

    return [
      ...this.devices.keys(),
    ];

  }

}