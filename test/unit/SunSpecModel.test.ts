import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import { SunSpecModel } from '../../src/sunspec/SunSpecModel.js';

describe(
  'SunSpecModel',
  () => {

    it(
      'creates a valid SunSpec model',
      () => {

        const registerMap =
          new DeviceRegisterMap();

        const model =
          new SunSpecModel(
            120,
            'Inverter',
            registerMap,
          );

        expect(
          model.id,
        ).toBe(
          120,
        );

        expect(
          model.name,
        ).toBe(
          'Inverter',
        );

        expect(
          model.registerMap,
        ).toBe(
          registerMap,
        );

      },
    );

    it(
      'rejects invalid ids',
      () => {

        expect(
          () =>
            new SunSpecModel(
              0,
              'Inverter',
              new DeviceRegisterMap(),
            ),
        ).toThrow(
          'Invalid SunSpec model id: 0',
        );

      },
    );

    it(
      'rejects empty names',
      () => {

        expect(
          () =>
            new SunSpecModel(
              120,
              '   ',
              new DeviceRegisterMap(),
            ),
        ).toThrow(
          'SunSpec model name must not be empty.',
        );

      },
    );

  },
);