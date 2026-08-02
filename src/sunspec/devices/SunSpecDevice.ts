import {
  ManagedDevice,
} from '../../device/ManagedDevice.js';

import {
  BatteryApi,
} from '../api/BatteryApi.js';

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

import {
  StorageApi,
} from '../api/StorageApi.js';

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

import {
  StorageModel713,
} from '../models/StorageModel713.js';

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

  public readonly storage:
    StorageApi | undefined;

  public readonly battery:
    BatteryApi | undefined;

  public constructor(

    private readonly deviceInformation:
      SunSpecDeviceInformation,

    private readonly container:
      SunSpecModelContainer,

    private readonly logicalDevice:
      ManagedDevice,

    hasSolarEdgeBattery = false,

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

    this.storage =
      this.deviceInformation.hasModel(
        StorageModel713.MODEL_ID,
      )
        ? new StorageApi(
          this,
        )
        : undefined;

    this.battery =
      hasSolarEdgeBattery
        ? new BatteryApi(
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

    const storagePromise =
      this.storage === undefined
        ? Promise.resolve(
          undefined,
        )
        : this.storage.snapshot();

    const batteryPromise =
      this.battery === undefined
        ? Promise.resolve(
          undefined,
        )
        : this.battery.snapshot();

    const [
      common,
      inverter,
      nameplate,
      meter,
      storage,
      battery,
    ] = await Promise.all([
      commonPromise,
      inverterPromise,
      nameplatePromise,
      meterPromise,
      storagePromise,
      batteryPromise,
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

      ...(storage === undefined
        ? {}
        : {
          storage,
        }),

      ...(battery === undefined
        ? {}
        : {
          battery,
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
