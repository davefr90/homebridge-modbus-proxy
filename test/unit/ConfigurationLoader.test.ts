import {
  describe,
  expect,
  it,
} from 'vitest';

import { ConfigurationLoader } from '../../src/config/ConfigurationLoader.js';
import type { ProxyConfiguration } from '../../src/config/ProxyConfiguration.js';

describe(
  'ConfigurationLoader',
  () => {

    const validConfiguration: ProxyConfiguration = {

      devices: [

        {

          id: 'solaredge',

          type: 'solaredge',

          host: '192.168.178.10',

          port: 502,

          unitId: 1,

        },

      ],

    };

    it(
      'loads valid configurations',
      () => {

        const loader =
          new ConfigurationLoader();

        expect(
          loader.load(
            validConfiguration,
          ),
        ).toBe(
          validConfiguration,
        );

      },
    );

    it(
      'rejects empty ids',
      () => {

        const loader =
          new ConfigurationLoader();

        expect(
          () =>
            loader.load({

              devices: [

                {

                  ...validConfiguration.devices[0],

                  id: '',

                },

              ],

            }),
        ).toThrow(
          'Device id must not be empty.',
        );

      },
    );

    it(
      'rejects invalid ports',
      () => {

        const loader =
          new ConfigurationLoader();

        expect(
          () =>
            loader.load({

              devices: [

                {

                  ...validConfiguration.devices[0],

                  port: 70000,

                },

              ],

            }),
        ).toThrow(
          'Invalid TCP port: 70000',
        );

      },
    );

    it(
      'rejects invalid unit ids',
      () => {

        const loader =
          new ConfigurationLoader();

        expect(
          () =>
            loader.load({

              devices: [

                {

                  ...validConfiguration.devices[0],

                  unitId: 248,

                },

              ],

            }),
        ).toThrow(
          'Invalid Modbus unit id: 248',
        );

      },
    );

  },
);