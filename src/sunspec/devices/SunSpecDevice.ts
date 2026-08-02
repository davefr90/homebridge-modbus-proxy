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
  MeterApi,
} from '../api/MeterApi.js';

import {
  NameplateApi,
} from '../api/NameplateApi.js';

import type {
  SunSpecPropertyValues,
} from '../api/SunSpecPropertyReader.js';

import type {
  SunSpecDiscoveryResult,
} from '../discovery/SunSpecDiscoveryResult.js';

import {
  MeterModel203,
} from '../models/MeterModel203.js';

import {
  NameplateModel120,
} from '../models/NameplateModel120.js';

import type {
  SystemSnapshot,
} from '../models/snapshots/SystemSnapshot.js';

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

import {
  SunSpecDeviceInformation,
} from './SunSpecDeviceInformation.js';

/**
 * Represents a generic SunSpec device.
 */
export class SunSpecDevice {

  public readonly common:
    CommonApi;

  public readonly inverter:
    InverterApi;

  public readonly nameplate:
    NameplateApi;

  public readonly meter:
    MeterApi | undefined;

  public constructor(

    private readonly deviceInformation:
      SunSpecDeviceInformation,

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

    this.meter =
      this.deviceInformation.hasModel(
        MeterModel203.MODEL_ID,
      )
        ? new MeterApi(
          this,
        )
        : undefined;

  }

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
   * Reads multiple typed SunSpec properties using optimized
   * contiguous Modbus block requests.
   */
  public async readMany<
    TProperties extends readonly SunSpecPropertyName[],
  >(
    properties: TProperties,
  ): Promise<
    SunSpecPropertyValues<TProperties>
  > {

    const values =
      await this.logicalDevice.readMany(
        properties,
      );

    return values as
      SunSpecPropertyValues<TProperties>;

  }

  public async write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    await this.logicalDevice.write(
      property,
      value,
    );

  }

  public async snapshot():
    Promise<SystemSnapshot> {

    const commonPromise =
      this.common.snapshot();

    const inverterPromise =
      this.inverter.snapshot();

    const nameplatePromise =
      this.deviceInformation.hasModel(
        NameplateModel120.MODEL_ID,
      )
        ? this.nameplate.snapshot()
        : Promise.resolve(
          undefined,
        );

    const meterPromise =
      this.meter === undefined
        ? Promise.resolve(
          undefined,
        )
        : this.meter.snapshot();

    const [
      common,
      inverter,
      nameplate,
      meter,
    ] = await Promise.all([
      commonPromise,
      inverterPromise,
      nameplatePromise,
      meterPromise,
    ]);

    return {
      common,
      inverter,

      ...(nameplate === undefined
        ? {}
        : {
          nameplate,
        }),

      ...(meter === undefined
        ? {}
        : {
          meter,
        }),
    };

  }

  public information():
    SunSpecDeviceInformation {

    return this.deviceInformation;

  }

  public discovery():
    SunSpecDiscoveryResult {

    return this.deviceInformation
      .discovery();

  }

  public models():
    readonly SunSpecModel[] {

    return this.container.models();

  }

  public size():
    number {

    return this.container.size();

  }

  public hasModel(
    modelId: number,
  ): boolean {

    return this.container.has(
      modelId,
    );

  }

  public model(
    modelId: number,
  ): SunSpecModel {

    return this.container.get(
      modelId,
    );

  }

  public managedDevice():
    ManagedDevice {

    return this.logicalDevice;

  }

}
