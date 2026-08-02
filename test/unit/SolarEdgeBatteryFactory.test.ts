import {
  describe,
  expect,
  it,
} from 'vitest';

import type {
  ModbusClient,
} from '../../src/client/ModbusClient.js';

import {
  SunSpecDiscoveryResult,
} from '../../src/sunspec/discovery/SunSpecDiscoveryResult.js';

import {
  SunSpecDeviceFactory,
} from '../../src/sunspec/SunSpecDeviceFactory.js';

import {
  SolarEdgeBatteryModel,
} from '../../src/sunspec/solaredge/SolarEdgeBatteryModel.js';

describe(
  'SolarEdge battery factory support',
  () => {

    const discoveryResult =
      new SunSpecDiscoveryResult(
        2,
        40000,
        [],
      );

    const modbusClient =
      {} as ModbusClient;

    it(
      'adds the battery API when a block was detected',
      () => {

        const device =
          SunSpecDeviceFactory.create(
            discoveryResult,
            modbusClient,
            SolarEdgeBatteryModel.PRIMARY_BASE_ADDRESS,
          );

        expect(
          device.battery,
        ).toBeDefined();

        expect(
          device.size(),
        ).toBe(
          0,
        );

      },
    );

    it(
      'does not add the battery API without a detected block',
      () => {

        const device =
          SunSpecDeviceFactory.create(
            discoveryResult,
            modbusClient,
          );

        expect(
          device.battery,
        ).toBeUndefined();

      },
    );

  },
);
