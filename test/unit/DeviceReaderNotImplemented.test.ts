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

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import type {
  RegisterReader,
  RegisterValue,
} from '../../src/model/RegisterReader.js';

import {
  PollFunction,
} from '../../src/polling/PollFunction.js';

/**
 * Creates a signed or unsigned Model 713 test definition.
 */
function createDefinition(
  name: string,
  address: number,
  options: {
    dataType?: RegisterDataType;
    scaleProperty?: string;
    notImplementedValue?: number;
  } = {},
): RegisterDefinition {

  return {
    unitId: 2,
    function:
      PollFunction.ReadHoldingRegisters,
    address,
    length: 1,
    dataType:
      options.dataType
      ?? RegisterDataType.Uint16,
    name,

    ...(options.scaleProperty === undefined
      ? {}
      : {
        scaleProperty:
            options.scaleProperty,
      }),

    ...(options.notImplementedValue === undefined
      ? {}
      : {
        notImplementedValue:
            options.notImplementedValue,
      }),
  };

}

describe(
  'DeviceReader not-implemented values',
  () => {

    it(
      'returns undefined before reading a dynamic scale factor',
      async () => {

        const valueDefinition =
          createDefinition(
            'Energy Rating',
            41266,
            {
              scaleProperty:
                'energyScaleFactor',
              notImplementedValue:
                0xFFFF,
            },
          );

        const scaleDefinition =
          createDefinition(
            'Energy Scale Factor',
            41271,
            {
              dataType:
                RegisterDataType.Int16,
              notImplementedValue:
                -32768,
            },
          );

        const registerMap =
          new DeviceRegisterMap();

        registerMap.add(
          'energyRating',
          valueDefinition,
        );

        registerMap.add(
          'energyScaleFactor',
          scaleDefinition,
        );

        const read =
          vi.fn()
            .mockResolvedValue(
              0xFFFF,
            );

        const reader =
          new DeviceReader(
            registerMap,
            {
              read,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'energyRating',
          ),
        ).resolves.toBeUndefined();

        expect(
          read,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'returns undefined for a grouped not-implemented value',
      async () => {

        const valueDefinition =
          createDefinition(
            'State of Health',
            41269,
            {
              scaleProperty:
                'percentageScaleFactor',
              notImplementedValue:
                0xFFFF,
            },
          );

        const scaleDefinition =
          createDefinition(
            'Percentage Scale Factor',
            41272,
            {
              dataType:
                RegisterDataType.Int16,
              notImplementedValue:
                -32768,
            },
          );

        const registerMap =
          new DeviceRegisterMap();

        registerMap.add(
          'stateOfHealth',
          valueDefinition,
        );

        registerMap.add(
          'percentageScaleFactor',
          scaleDefinition,
        );

        const readGroup =
          vi.fn(
            async () =>
              new Map<
                RegisterDefinition,
                RegisterValue
              >([
                [
                  valueDefinition,
                  0xFFFF,
                ],
                [
                  scaleDefinition,
                  -2,
                ],
              ]),
          );

        const reader =
          new DeviceReader(
            registerMap,
            {
              readGroup,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.readMany(
            [
              'stateOfHealth',
            ],
          ),
        ).resolves.toEqual({
          stateOfHealth:
            undefined,
        });

      },
    );

    it(
      'still scales an implemented grouped value',
      async () => {

        const valueDefinition =
          createDefinition(
            'State of Charge',
            41268,
            {
              scaleProperty:
                'percentageScaleFactor',
              notImplementedValue:
                0xFFFF,
            },
          );

        const scaleDefinition =
          createDefinition(
            'Percentage Scale Factor',
            41272,
            {
              dataType:
                RegisterDataType.Int16,
              notImplementedValue:
                -32768,
            },
          );

        const registerMap =
          new DeviceRegisterMap();

        registerMap.add(
          'stateOfCharge',
          valueDefinition,
        );

        registerMap.add(
          'percentageScaleFactor',
          scaleDefinition,
        );

        const readGroup =
          vi.fn(
            async () =>
              new Map<
                RegisterDefinition,
                RegisterValue
              >([
                [
                  valueDefinition,
                  9900,
                ],
                [
                  scaleDefinition,
                  -2,
                ],
              ]),
          );

        const reader =
          new DeviceReader(
            registerMap,
            {
              readGroup,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.readMany(
            [
              'stateOfCharge',
            ],
          ),
        ).resolves.toEqual({
          stateOfCharge: 99,
        });

      },
    );

  },
);
