import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  RegisterGroupBuilder,
} from '../../src/model/RegisterGroupBuilder.js';

import {
  RegisterDefinitionBuilder,
} from '../../src/model/RegisterDefinitionBuilder.js';

import type {
  RegisterDefinition,
} from '../../src/model/RegisterDefinition.js';

/**
 * Creates a holding-register definition for tests.
 */
function createRegister(
  address: number,
  length = 1,
  options: {
    unitId?: number;
    pollIntervalMs?: number;
    name?: string;
  } = {},
): RegisterDefinition {

  const builder =
    RegisterDefinitionBuilder
      .create()
      .unitId(
        options.unitId ??
        1,
      )
      .holdingRegister()
      .address(
        address,
      )
      .length(
        length,
      )
      .dataType(
        'uint16',
      )
      .name(
        options.name ??
        `Register ${address}`,
      );

  if (
    options.pollIntervalMs !== undefined
  ) {
    builder.pollIntervalMs(
      options.pollIntervalMs,
    );
  }

  return builder.build();

}

describe(
  'RegisterGroupBuilder',
  () => {

    it(
      'returns an empty array for no registers',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [],
            );

        expect(
          groups,
        ).toEqual(
          [],
        );

      },
    );

    it(
      'creates one group for one register',
      () => {

        const register =
          createRegister(
            40000,
            2,
          );

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                register,
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0],
        ).toEqual(
          {
            unitId: 1,
            function: register.function,
            startAddress: 40000,
            length: 2,
            registers: [
              register,
            ],
          },
        );

      },
    );

    it(
      'sorts registers by address',
      () => {

        const register40002 =
          createRegister(
            40002,
          );

        const register40000 =
          createRegister(
            40000,
          );

        const register40001 =
          createRegister(
            40001,
          );

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                register40002,
                register40000,
                register40001,
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0]?.registers,
        ).toEqual(
          [
            register40000,
            register40001,
            register40002,
          ],
        );

      },
    );

    it(
      'groups directly adjacent registers',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                  2,
                ),
                createRegister(
                  40002,
                  1,
                ),
                createRegister(
                  40003,
                  2,
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0]?.startAddress,
        ).toBe(
          40000,
        );

        expect(
          groups[0]?.length,
        ).toBe(
          5,
        );

      },
    );

    it(
      'groups overlapping registers',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                  4,
                ),
                createRegister(
                  40002,
                  4,
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0]?.startAddress,
        ).toBe(
          40000,
        );

        expect(
          groups[0]?.length,
        ).toBe(
          6,
        );

      },
    );

    it(
      'creates separate groups when a gap exists by default',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                ),
                createRegister(
                  40002,
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'combines registers within the configured maximum gap',
      () => {

        const groups =
          new RegisterGroupBuilder(
            {
              maxGap: 2,
            },
          ).build(
            [
              createRegister(
                40000,
              ),
              createRegister(
                40003,
              ),
            ],
          );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0]?.startAddress,
        ).toBe(
          40000,
        );

        expect(
          groups[0]?.length,
        ).toBe(
          4,
        );

      },
    );

    it(
      'creates separate groups when the maximum gap is exceeded',
      () => {

        const groups =
          new RegisterGroupBuilder(
            {
              maxGap: 1,
            },
          ).build(
            [
              createRegister(
                40000,
              ),
              createRegister(
                40003,
              ),
            ],
          );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'creates separate groups for different unit ids',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                  1,
                  {
                    unitId: 1,
                  },
                ),
                createRegister(
                  40001,
                  1,
                  {
                    unitId: 2,
                  },
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'creates separate groups for different polling intervals',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                  1,
                  {
                    pollIntervalMs:
                      1000,
                  },
                ),
                createRegister(
                  40001,
                  1,
                  {
                    pollIntervalMs:
                      5000,
                  },
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'does not exceed the configured maximum group length',
      () => {

        const groups =
          new RegisterGroupBuilder(
            {
              maxRegistersPerGroup:
                4,
            },
          ).build(
            [
              createRegister(
                40000,
                2,
              ),
              createRegister(
                40002,
                2,
              ),
              createRegister(
                40004,
                2,
              ),
            ],
          );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

        expect(
          groups[0]?.startAddress,
        ).toBe(
          40000,
        );

        expect(
          groups[0]?.length,
        ).toBe(
          4,
        );

        expect(
          groups[1]?.startAddress,
        ).toBe(
          40004,
        );

        expect(
          groups[1]?.length,
        ).toBe(
          2,
        );

      },
    );

    it(
      'allows the Modbus maximum of 125 registers',
      () => {

        const groups =
          new RegisterGroupBuilder()
            .build(
              [
                createRegister(
                  40000,
                  125,
                ),
              ],
            );

        expect(
          groups,
        ).toHaveLength(
          1,
        );

        expect(
          groups[0]?.length,
        ).toBe(
          125,
        );

      },
    );

    it(
      'throws when one register exceeds the maximum group length',
      () => {

        expect(
          () =>
            new RegisterGroupBuilder()
              .build(
                [
                  createRegister(
                    40000,
                    126,
                    {
                      name:
                        'Oversized register',
                    },
                  ),
                ],
              ),
        ).toThrow(
          'Register "Oversized register" exceeds the maximum group length: 126',
        );

      },
    );

    it(
      'throws for a negative maximum gap',
      () => {

        expect(
          () =>
            new RegisterGroupBuilder(
              {
                maxGap: -1,
              },
            ),
        ).toThrow(
          'Invalid maximum register gap: -1',
        );

      },
    );

    it(
      'throws when the maximum group length exceeds the Modbus limit',
      () => {

        expect(
          () =>
            new RegisterGroupBuilder(
              {
                maxRegistersPerGroup:
                  126,
              },
            ),
        ).toThrow(
          'Invalid maximum registers per group: 126',
        );

      },
    );

  },
);
