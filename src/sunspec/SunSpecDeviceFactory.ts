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
  NameplateModel120,
} from './models/NameplateModel120.js';

import {
  SunSpecModelContainer,
} from './SunSpecModelContainer.js';

/**
 * Creates a complete SunSpec device from a discovery result.
 *
 * Only models supported by this library are added to the
 * resulting device. Unknown models remain available through
 * the discovery result but are ignored by the device factory.
 */
export class SunSpecDeviceFactory {

  /**
   * Creates a complete SunSpec device.
   *
   * The resulting device contains:
   *
   * - supported SunSpec models
   * - a namespaced composite register map
   * - logical register reading
   * - logical register writing
   *
   * @param discoveryResult Result returned by SunSpecDiscovery.
   * @param modbusClient Connected Modbus TCP client.
   */
  public static create(
    discoveryResult: SunSpecDiscoveryResult,
    modbusClient: ModbusClient,
  ): SunSpecDevice {

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
      container,
      managedDevice,
    );

  }

  /**
   * Adds one supported discovered model to the device.
   *
   * Unsupported model identifiers are intentionally ignored.
   */
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

        SunSpecDeviceFactory
          .validateModelLength(
            discoveredModel,
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

      default:

        /*
         * Unknown models remain part of the discovery result
         * but are not represented by a SunSpecModel until a
         * matching implementation exists.
         */
        return;

    }

  }

  /**
   * Verifies that a discovered model has the length expected
   * by its model implementation.
   */
  private static validateModelLength(
    discoveredModel: SunSpecDiscoveredModel,
    expectedLength: number,
  ): void {

    if (
      discoveredModel.length !==
      expectedLength
    ) {
      throw new Error(
        `Invalid length for SunSpec model ` +
        `${discoveredModel.id}: expected ` +
        `${expectedLength}, received ` +
        `${discoveredModel.length}.`,
      );
    }

  }

}