import {
  describe,
  expect,
  it,
} from 'vitest';

import type { RegisterMap } from '../../src/model/RegisterMap.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'RegisterMap',
  () => {

    it(
      'contains device metadata and registers',
      () => {

        const map: RegisterMap = {

          name: 'Example Device',

          registers: [

            {

              unitId: 1,
              function: PollFunction.ReadHoldingRegisters,
              address: 0,
              length: 2,
              dataType: RegisterDataType.Float32,
              name: 'Power',
              unit: 'W',

            },

          ],

        };

        expect(
          map.name,
        ).toBe(
          'Example Device',
        );

        expect(
          map.registers,
        ).toHaveLength(
          1,
        );

      },
    );

  },
);