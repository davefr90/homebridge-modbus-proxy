import {
  describe,
  expect,
  it,
} from 'vitest';

import type { ModbusClient } from '../../src/client/ModbusClient.js';
import type { DeviceDefinition } from '../../src/device/DeviceDefinition.js';
import { ManagedDevice } from '../../src/device/ManagedDevice.js';
import { DeviceFactory } from '../../src/model/DeviceFactory.js';

describe(
  'DeviceFactory',
  () => {

    it(
      'creates managed devices',
      () => {

        const client = {

        } as unknown as ModbusClient;

        const definition = {

          info: {

          },

          registerMap: {

          },

        } as unknown as DeviceDefinition;

        const factory =
          new DeviceFactory(
            client,
          );

        const device =
          factory.create(
            definition,
          );

        expect(
          device,
        ).toBeInstanceOf(
          ManagedDevice,
        );

      },
    );

  },
);