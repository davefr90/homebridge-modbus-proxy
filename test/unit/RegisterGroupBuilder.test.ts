import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { RegisterGroupBuilder } from '../../src/model/RegisterGroupBuilder.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'RegisterGroupBuilder',
  () => {

    const builder =
      new RegisterGroupBuilder();

    function register(
      address: number,
      length: number,
      functionType =
        PollFunction.ReadHoldingRegisters,
      unitId = 1,
    ): RegisterDefinition {

      return {
        unitId,
        function: functionType,
        address,
        length,
        dataType: RegisterDataType.Uint16,
        name: `Register ${address}`,
      };

    }

    it(
      'returns an empty array for no registers',
      () => {

        expect(
          builder.build([]),
        ).toEqual([]);

      },
    );

    it(
      'creates one group for one register',
      () => {

        const groups =
          builder.build([
            register(
              100,
              2,
            ),
          ]);

        expect(groups).toHaveLength(1);

        expect(groups[0]).toMatchObject({
          unitId: 1,
          function:
            PollFunction.ReadHoldingRegisters,
          startAddress: 100,
          length: 2,
        });

      },
    );

    it(
      'combines adjacent registers',
      () => {

        const groups =
          builder.build([
            register(
              100,
              2,
            ),
            register(
              102,
              1,
            ),
          ]);

        expect(groups).toHaveLength(1);

        expect(groups[0]).toMatchObject({
          startAddress: 100,
          length: 3,
        });

        expect(
          groups[0].registers,
        ).toHaveLength(2);

      },
    );

    it(
      'combines overlapping registers',
      () => {

        const groups =
          builder.build([
            register(
              100,
              3,
            ),
            register(
              102,
              2,
            ),
          ]);

        expect(groups).toHaveLength(1);

        expect(groups[0]).toMatchObject({
          startAddress: 100,
          length: 4,
        });

      },
    );

    it(
      'creates separate groups for register gaps',
      () => {

        const groups =
          builder.build([
            register(
              100,
              2,
            ),
            register(
              110,
              2,
            ),
          ]);

        expect(groups).toHaveLength(2);

      },
    );

    it(
      'creates separate groups for different functions',
      () => {

        const groups =
          builder.build([
            register(
              100,
              1,
              PollFunction.ReadHoldingRegisters,
            ),
            register(
              101,
              1,
              PollFunction.ReadInputRegisters,
            ),
          ]);

        expect(groups).toHaveLength(2);

      },
    );

    it(
      'creates separate groups for different unit ids',
      () => {

        const groups =
          builder.build([
            register(
              100,
              1,
              PollFunction.ReadHoldingRegisters,
              1,
            ),
            register(
              101,
              1,
              PollFunction.ReadHoldingRegisters,
              2,
            ),
          ]);

        expect(groups).toHaveLength(2);

      },
    );

    it(
      'sorts registers before grouping',
      () => {

        const groups =
          builder.build([
            register(
              102,
              1,
            ),
            register(
              100,
              2,
            ),
          ]);

        expect(groups).toHaveLength(1);

        expect(groups[0]).toMatchObject({
          startAddress: 100,
          length: 3,
        });

      },
    );
    it(
  'creates separate groups for different polling intervals',
  () => {

    const groups =
      builder.build([
        {
          ...register(
            100,
            2,
          ),
          pollIntervalMs: 1000,
        },
        {
          ...register(
            102,
            1,
          ),
          pollIntervalMs: 5000,
        },
      ]);

    expect(groups).toHaveLength(2);

  },
);

it(
  'combines registers with identical polling intervals',
  () => {

    const groups =
      builder.build([
        {
          ...register(
            100,
            2,
          ),
          pollIntervalMs: 1000,
        },
        {
          ...register(
            102,
            1,
          ),
          pollIntervalMs: 1000,
        },
      ]);

    expect(groups).toHaveLength(1);

    expect(groups[0]).toMatchObject({
      startAddress: 100,
      length: 3,
    });

    },
    );
  },
);