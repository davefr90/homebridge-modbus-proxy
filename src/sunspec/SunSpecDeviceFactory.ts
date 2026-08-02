import type {
  ModbusClient,
} from '../client/ModbusClient.js';

import {
  CompositeDeviceRegisterMap,
} from '../device/CompositeDeviceRegisterMap.js';

import {
  DeviceReader,
} from '../device/DeviceReader.js';

import {
  DeviceWriter,
} from '../device/DeviceWriter.js';

import {
  ManagedDevice,
} from '../device/ManagedDevice.js';

import {
  RegisterReader,
} from '../model/RegisterReader.js';

import {
  RegisterWriter,
} from '../model/RegisterWriter.js';

import {
  SunSpecDevice,
} from './devices/SunSpecDevice.js';

import {
  SunSpecDeviceInformation,
} from './devices/SunSpecDeviceInformation.js';

import type {
  SunSpecDiscoveredModel,
} from './discovery/SunSpecDiscoveredModel.js';

import {
  SunSpecDiscoveryResult,
} from './discovery/SunSpecDiscoveryResult.js';

import {
  CommonModel,
} from './models/CommonModel.js';

import {
  InverterModel103,
} from './models/InverterModel103.js';

import {
  MeterModel203,
} from './models/MeterModel203.js';

import {
  NameplateModel120,
} from './models/NameplateModel120.js';

import {
  StorageModel713,
} from './models/StorageModel713.js';

import {
  SunSpecModelContainer,
} from './SunSpecModelContainer.js';

/**
 * Creates a complete SunSpec device from a discovery result.
 */
export class SunSpecDeviceFactory {

  public static create(
    discoveryResult: SunSpecDiscoveryResult,
    modbusClient: ModbusClient,
  ): SunSpecDevice {

    const deviceInformation =
      new SunSpecDeviceInformation(
        discoveryResult,
      );

    const container =
      new SunSpecModelContainer();

    const registerMap =
      CompositeDeviceRegisterMap
        .create();

    for (
      const discoveredModel
      of discoveryResult.models()
    ) {

      SunSpecDeviceFactory.addModel(
        container,
        registerMap,
        discoveryResult,
        discoveredModel,
      );

    }

    const registerReader =
      new RegisterReader(
        modbusClient,
      );

    const registerWriter =
      new RegisterWriter(
        modbusClient,
      );

    const deviceReader =
      new DeviceReader(
        registerMap,
        registerReader,
      );

    const deviceWriter =
      new DeviceWriter(
        registerMap,
        registerWriter,
      );

    const managedDevice =
      new ManagedDevice(
        deviceReader,
        deviceWriter,
      );

    return new SunSpecDevice(
      deviceInformation,
      container,
      managedDevice,
    );

  }

  private static addModel(
    container: SunSpecModelContainer,
    registerMap: CompositeDeviceRegisterMap,
    discoveryResult: SunSpecDiscoveryResult,
    discoveredModel: SunSpecDiscoveredModel,
  ): void {

    switch (
      discoveredModel.id
    ) {

    case CommonModel.MODEL_ID: {

      /*
         * SolarEdge exposes another Common Model directly
         * before its embedded meter. The current public API
         * represents the primary device Common Model only.
         */
      if (
        container.has(
          CommonModel.MODEL_ID,
        )
      ) {
        return;
      }

      SunSpecDeviceFactory
        .validateModelLength(
          discoveredModel,
          CommonModel.MODEL_LENGTH_WITHOUT_PAD,
          CommonModel.MODEL_LENGTH,
        );

      const model =
          CommonModel.create(
            discoveryResult.unitId,
            discoveryResult.baseAddress,
          );

      container.add(
        model,
      );

      registerMap.addMap(
        'common',
        model.registerMap,
      );

      return;

    }

    case InverterModel103.MODEL_ID: {

      SunSpecDeviceFactory
        .validateModelLength(
          discoveredModel,
          InverterModel103.MODEL_LENGTH,
        );

      const model =
          InverterModel103.create(
            discoveryResult.unitId,
            discoveredModel.headerAddress,
          );

      container.add(
        model,
      );

      registerMap.addMap(
        'inverter',
        model.registerMap,
      );

      return;

    }

    case NameplateModel120.MODEL_ID: {

      SunSpecDeviceFactory
        .validateModelLength(
          discoveredModel,
          NameplateModel120.MODEL_LENGTH,
        );

      const model =
          NameplateModel120.create(
            discoveryResult.unitId,
            discoveredModel.headerAddress,
          );

      container.add(
        model,
      );

      registerMap.addMap(
        'nameplate',
        model.registerMap,
      );

      return;

    }

    case MeterModel203.MODEL_ID: {

      SunSpecDeviceFactory
        .validateModelLength(
          discoveredModel,
          MeterModel203.MODEL_LENGTH,
        );

      const model =
          MeterModel203.create(
            discoveryResult.unitId,
            discoveredModel.headerAddress,
          );

      container.add(
        model,
      );

      registerMap.addMap(
        'meter',
        model.registerMap,
      );

      return;

    }

    case StorageModel713.MODEL_ID: {

      SunSpecDeviceFactory
        .validateModelLength(
          discoveredModel,
          StorageModel713.MODEL_LENGTH,
        );

      const model =
          StorageModel713.create(
            discoveryResult.unitId,
            discoveredModel.headerAddress,
          );

      container.add(
        model,
      );

      registerMap.addMap(
        'storage',
        model.registerMap,
      );

      return;

    }

    default:
      return;

    }

  }

  private static validateModelLength(
    discoveredModel: SunSpecDiscoveredModel,
    ...expectedLengths: number[]
  ): void {

    if (
      expectedLengths.includes(
        discoveredModel.length,
      )
    ) {
      return;
    }

    const expectedDescription =
      expectedLengths.join(
        ' or ',
      );

    throw new Error(
      'Invalid length for SunSpec model ' +
      `${discoveredModel.id}: expected ` +
      `${expectedDescription}, received ` +
      `${discoveredModel.length}.`,
    );

  }

}
