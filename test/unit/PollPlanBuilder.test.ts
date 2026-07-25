import {
  describe,
  expect,
  it,
} from 'vitest';

import type { RegisterGroup } from '../../src/model/RegisterGroup.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollPlanBuilder } from '../../src/polling/PollPlanBuilder.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'PollPlanBuilder',
  () => {

    const builder =
      new PollPlanBuilder();

    const group: RegisterGroup = {

      unitId: 1,

      function:
        PollFunction.ReadHoldingRegisters,

      startAddress: 100,

      length: 2,

      registers: [

        {

          unitId: 1,

          function:
            PollFunction.ReadHoldingRegisters,

          address: 100,

          length: 2,

          dataType:
            RegisterDataType.Float32,

          name: 'Power',

        },

      ],

    };

    it(
      'creates one poll plan entry',
      () => {

        const plan =
          builder.build([
            group,
          ]);

        expect(plan).toHaveLength(1);

        expect(
          plan[0].group,
        ).toBe(group);

        expect(
          plan[0].intervalMs,
        ).toBe(1000);

      },
    );

    it(
      'uses a custom polling interval',
      () => {

        const plan =
          builder.build(
            [
              group,
            ],
            5000,
          );

        expect(
          plan[0].intervalMs,
        ).toBe(5000);

      },
    );

    it(
      'returns an empty plan',
      () => {

        expect(
          builder.build([]),
        ).toEqual([]);

      },
    );
    it(
  'uses register polling interval',
  () => {

    const customGroup: RegisterGroup = {

      ...group,

      registers: [

        {

          ...group.registers[0],

          pollIntervalMs: 2500,

        },

      ],

    };

    const plan =
      builder.build([
        customGroup,
      ]);

    expect(
      plan[0].intervalMs,
    ).toBe(2500);

  },
);

it(
  'falls back to default interval',
  () => {

    const plan =
      builder.build(
        [
          group,
        ],
        5000,
      );

    expect(
      plan[0].intervalMs,
    ).toBe(5000);

  },
);    
    },
);