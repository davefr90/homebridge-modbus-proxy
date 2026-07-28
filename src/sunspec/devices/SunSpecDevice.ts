import {
  ManagedDevice,
} from '../../device/ManagedDevice.js';

import {
  SunSpecModel,
} from '../SunSpecModel.js';

import {
  SunSpecModelContainer,
} from '../SunSpecModelContainer.js';

/**
 * Represents a generic SunSpec device.
 *
 * A SunSpec device contains the supported SunSpec models
 * discovered on a Modbus device and provides logical
 * property-based read and write access.
 */
export class SunSpecDevice {

  /**
   * Creates a new SunSpec device.
   *
   * @param container Collection of supported SunSpec models.
   * @param managedDevice Logical Modbus device used for
   * reading and writing properties.
   */
  public constructor(

    private readonly container:
      SunSpecModelContainer,

    private readonly logicalDevice:
      ManagedDevice,

  ) {
  }

  /**
   * Reads a logical SunSpec device property.
   *
   * Examples:
   *
   * common.manufacturer
   * common.serialNumber
   * inverter.acPower
   */
  public async read(
    property: string,
  ): Promise<boolean | number | string> {

    return this.logicalDevice.read(
      property,
    );

  }

  /**
   * Writes a logical SunSpec device property.
   */
  public async write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    await this.logicalDevice.write(
      property,
      value,
    );

  }

  /**
   * Returns all supported SunSpec models.
   */
  public models():
    readonly SunSpecModel[] {

    return this.container.models();

  }

  /**
   * Returns the number of supported SunSpec models.
   */
  public size(): number {

    return this.container.size();

  }

  /**
   * Returns whether a supported SunSpec model exists.
   *
   * @param modelId SunSpec model identifier.
   */
  public hasModel(
    modelId: number,
  ): boolean {

    return this.container.has(
      modelId,
    );

  }

  /**
   * Returns a supported SunSpec model.
   *
   * @param modelId SunSpec model identifier.
   */
  public model(
    modelId: number,
  ): SunSpecModel {

    return this.container.get(
      modelId,
    );

  }

  /**
   * Returns the internal logical Modbus device.
   *
   * Intended for advanced use cases.
   */
  public managedDevice():
    ManagedDevice {

    return this.logicalDevice;

  }

}