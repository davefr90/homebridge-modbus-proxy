import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  DeviceReader,
} from '../../src/device/DeviceReader.js';

import {
  DeviceRegisterMap,
} from '../../src/device/DeviceRegisterMap.js';

import type {
  RegisterDefinition,
} from '../../src/model/RegisterDefinition.js';

import type {
  RegisterReader,
} from '../../src/model/RegisterReader.js';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  PollFunction,
} from '../../src/polling/PollFunction.js';

/**
 * Creates a signed holding-register definition.
 */
function createDefinition(
  name: string,
  address: number,
  scaleProperty?: string,
): RegisterDefinition {

  return {
    unitId: 2,
    function:
      PollFunction.ReadHoldingRegisters,
    address,
    length: 1,
    dataType:
      RegisterDataType.Int16,
    name,

    ...(scaleProperty === undefined
      ? {}
      : {
        scaleProperty,
      }),
  };

}

describe(
  'DeviceReader block reads',
  () => {

    it(
      'reads values and their dynamic scale factors in one group',
      async () => {

        const powerDefinition =
          createDefinition(
            'Power',
            100,
            'powerScaleFactor',
          );

        const powerScaleDefinition =
          createDefinition(
            'Power Scale Factor',
            104,
          );

        const frequencyDefinition =
          createDefinition(
            'Frequency',
            110,
            'frequencyScaleFactor',
          );

        const frequencyScaleDefinition =
          createDefinition(
            'Frequency Scale Factor',
            111,
          );

        const registerMap =
          new DeviceRegisterMap();

        registerMap.add(
          'power',
          powerDefinition,
        );

        registerMap.add(
          'powerScaleFactor',
          powerScaleDefinition,
        );

        registerMap.add(
          'frequency',
          frequencyDefinition,
        );

        registerMap.add(
          'frequencyScaleFactor',
          frequencyScaleDefinition,
        );

        const readGroup =
          vi.fn(
            async () =>
              new Map([
                [
                  powerDefinition,
                  2300,
                ],
                [
                  powerScaleDefinition,
                  -1,
                ],
                [
                  frequencyDefinition,
                  5000,
                ],
                [
                  frequencyScaleDefinition,
                  -2,
                ],
              ]),
          );

        const read =
          vi.fn();

        const reader =
          new DeviceReader(
            registerMap,
            {
              read,
              readGroup,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.readMany(
            [
              'power',
              'frequency',
            ],
          ),
        ).resolves.toEqual({
          power: 230,
          frequency: 50,
        });

        expect(
          read,
        ).not.toHaveBeenCalled();

        expect(
          readGroup,
        ).toHaveBeenCalledTimes(
          1,
        );

        const group =
          readGroup.mock.calls[0]?.[0];

        expect(
          group,
        ).toMatchObject({
          unitId: 2,
          function:
            PollFunction.ReadHoldingRegisters,
          startAddress: 100,
          length: 12,
        });

        expect(
          group?.registers,
        ).toEqual([
          powerDefinition,
          powerScaleDefinition,
          frequencyDefinition,
          frequencyScaleDefinition,
        ]);

      },
    );

    it(
      'reads separate register groups sequentially',
      async () => {

        const firstDefinition =
          createDefinition(
            'First Value',
            100,
          );

        const secondDefinition =
          createDefinition(
            'Second Value',
            300,
          );

        const registerMap =
          new DeviceRegisterMap();

        registerMap.add(
          'first',
          firstDefinition,
        );

        registerMap.add(
          'second',
          secondDefinition,
        );

        const callOrder:
          string[] = [];

        const readGroup =
          vi.fn(
            async (group) => {

              callOrder.push(
                `start:${group.startAddress}`,
              );

              await Promise.resolve();

              callOrder.push(
                `end:${group.startAddress}`,
              );

              const definition =
                group.registers[0];

              if (definition === undefined) {
                throw new Error(
                  'Expected a register definition.',
                );
              }

              return new Map([
                [
                  definition,
                  group.startAddress,
                ],
              ]);

            },
          );

        const reader =
          new DeviceReader(
            registerMap,
            {
              read:
                vi.fn(),
              readGroup,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.readMany([
            'first',
            'second',
          ]),
        ).resolves.toEqual({
          first: 100,
          second: 300,
        });

        expect(
          callOrder,
        ).toEqual([
          'start:100',
          'end:100',
          'start:300',
          'end:300',
        ]);

      },
    );

  },
);
