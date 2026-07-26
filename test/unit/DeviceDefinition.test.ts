import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceDefinition } from '../../src/device/DeviceDefinition.js';
import type { DeviceInfo } from '../../src/device/DeviceInfo.js';
import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';

describe(
  'DeviceDefinition',
  () => {

    it(
      'stores device information and register map',
      () => {

        const info: DeviceInfo = {

          manufacturer: 'SolarEdge',

          model: 'SE10K',

          name: 'Garage Inverter',

        };

        const registerMap =
          new DeviceRegisterMap();

        const definition =
          new DeviceDefinition(
            info,
            registerMap,
          );

        expect(
          definition.info,
        ).toBe(info);

        expect(
          definition.registerMap,
        ).toBe(registerMap);

      },
    );

  },
);