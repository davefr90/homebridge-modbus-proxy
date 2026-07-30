import {
  ManagedDevice,
} from '../../device/ManagedDevice.js';

import {
  CommonApi,
} from '../api/CommonApi.js';

import {
  InverterApi,
} from '../api/InverterApi.js';

import {
  NameplateApi,
} from '../api/NameplateApi.js';

import {
  SunSpecModel,
} from '../SunSpecModel.js';

import {
  SunSpecModelContainer,
} from '../SunSpecModelContainer.js';

import type {
  SunSpecPropertyName,
  SunSpecPropertyValue,
} from '../SunSpecPropertyTypes.js';

/**
 * Represents a generic SunSpec device.
 *
 * A SunSpec device contains the supported SunSpec models
 * discovered on a Modbus device and provides logical
 * property-based read and write access.
 */
export class SunSpecDevice {

  /**
   * Common Model API.
   *
   * SunSpec Model ID: 1
   */
  public readonly common:
    CommonApi;

  /**
   * Inverter Model API.
   *
   * Currently backed by SunSpec Model ID 103.
   */
  public readonly inverter:
    InverterApi;

  /**
   * Nameplate Model API.
   *
   * SunSpec Model ID: 120
   */
  public readonly nameplate:
    NameplateApi;

  /**
   * Creates a new SunSpec device.
   *
   * @param container Collection of supported SunSpec models.
   * @param logicalDevice Logical Modbus device used for
   * reading and writing properties.
   */
  public constructor(

    private readonly container:
      SunSpecModelContainer,

    private readonly logicalDevice:
      ManagedDevice,

  ) {

    this.common =
      new CommonApi(
        this,
      );

    this.inverter =
      new InverterApi(
        this,
      );

    this.nameplate =
      new NameplateApi(
        this,
      );

  }

  /**
   * Reads a typed logical SunSpec device property.
   *
   * The return type is inferred from the supplied property.
   */
  public async read<
    TProperty extends SunSpecPropertyName,
  >(
    property: TProperty,
  ): Promise<
    SunSpecPropertyValue<TProperty>
  > {

    const value =
      await this.logicalDevice.read(
        property,
      );

    return value as
      SunSpecPropertyValue<TProperty>;

  }

  /**
   * Writes a logical SunSpec device property.
   *
   * Writable property typing will be introduced separately,
   * so read-only properties cannot accidentally be exposed
   * as writable.
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