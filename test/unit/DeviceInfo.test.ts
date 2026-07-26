import {
  describe,
  expect,
  it,
} from 'vitest';

import type { DeviceInfo } from '../../src/device/DeviceInfo.js';

describe(
  'DeviceInfo',
  () => {

    it(
      'stores device metadata',
      () => {

        const info: DeviceInfo = {

          manufacturer: 'SolarEdge',

          model: 'SE10K',

          name: 'Garage Inverter',

        };

        expect(
          info.manufacturer,
        ).toBe(
          'SolarEdge',
        );

        expect(
          info.model,
        ).toBe(
          'SE10K',
        );

        expect(
          info.name,
        ).toBe(
          'Garage Inverter',
        );

      },
    );

  },
);