import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'DeviceRegisterMap',
  () => {

    it(
      'stores register definitions',
      () => {

        const map =
          new DeviceRegisterMap();

        const definition = {

          unitId: 1,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 100,
          length: 1,
          dataType:
            RegisterDataType.Uint16,
          name: 'Power',

        };

        map.add(
          'power',
          definition,
        );

        expect(
          map.has(
            'power',
          ),
        ).toBe(true);

        expect(
          map.get(
            'power',
          ),
        ).toBe(definition);

      },
    );

    it(
      'throws for unknown properties',
      () => {

        const map =
          new DeviceRegisterMap();

        expect(() =>
          map.get(
            'unknown',
          ),
        ).toThrow(
          'Unknown device property: unknown',
        );

      },
    );

  },
);