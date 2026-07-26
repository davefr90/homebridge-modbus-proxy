import {
  describe,
  expect,
  it,
} from 'vitest';

import type { ProxyConfiguration } from '../../src/config/ProxyConfiguration.js';

describe(
  'ProxyConfiguration',
  () => {

    it(
      'stores device configuration',
      () => {

        const configuration: ProxyConfiguration = {

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

        expect(
          configuration.devices,
        ).toHaveLength(
          1,
        );

        expect(
          configuration.devices[0].id,
        ).toBe(
          'solaredge',
        );

      },
    );

  },
);