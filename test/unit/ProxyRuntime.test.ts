import {
  describe,
  expect,
  it,
} from 'vitest';

import type { ModbusClient } from '../../src/client/ModbusClient.js';
import type { DeviceDefinition } from '../../src/device/DeviceDefinition.js';
import { ProxyRuntime } from '../../src/runtime/ProxyRuntime.js';

describe(
  'ProxyRuntime',
  () => {

    it(
      'creates runtime components',
      () => {

        const client = {

        } as unknown as ModbusClient;

        const runtime =
          new ProxyRuntime(
            client,
          );

        expect(
          runtime.catalog,
        ).toBeDefined();

        expect(
          runtime.factory,
        ).toBeDefined();

        expect(
          runtime.registry,
        ).toBeDefined();

        expect(
          runtime.definitions,
        ).toBeDefined();

      },
    );

    it(
      'initializes registered device definitions',
      () => {

        const client = {

        } as unknown as ModbusClient;

        const runtime =
          new ProxyRuntime(
            client,
          );

        runtime.catalog.register(
          'device-1',
          {

            info: {},

            registerMap: {},

          } as unknown as DeviceDefinition,
        );

        runtime.initialize();

        expect(
          runtime.registry.has(
            'device-1',
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'loads device configurations',
      () => {

        const runtime =
          new ProxyRuntime(
            {} as unknown as ModbusClient,
          );

        const definition =
          {} as DeviceDefinition;

        runtime.definitions.register(
          'solaredge',
          definition,
        );

        runtime.load({

          devices: [

            {

              id: 'wr1',

              type: 'solaredge',

              host: '127.0.0.1',

              port: 502,

              unitId: 1,

            },

          ],

        });

        expect(
          runtime.catalog.has(
            'wr1',
          ),
        ).toBe(
          true,
        );

        expect(
          runtime.catalog.get(
            'wr1',
          ),
        ).toBe(
          definition,
        );

      },
    );

  },
);