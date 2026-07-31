import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { DeviceReader } from '../../src/device/DeviceReader.js';
import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import type { RegisterReader } from '../../src/model/RegisterReader.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'DeviceReader',
  () => {

    const createDefinition =
      (
        name: string,
        address: number,
        scaleProperty?: string,
      ): RegisterDefinition => ({

        unitId: 1,

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

      });

    it(
      'reads a logical device property',
      async () => {

        const map =
          new DeviceRegisterMap();

        const definition =
          createDefinition(
            'Power',
            100,
          );

        map.add(
          'power',
          definition,
        );

        const read =
          vi.fn(
            async () => 123,
          );

        const registerReader = {
          read,
        } as unknown as RegisterReader;

        const reader =
          new DeviceReader(
            map,
            registerReader,
          );

        await expect(
          reader.read(
            'power',
          ),
        ).resolves.toBe(
          123,
        );

        expect(
          read,
        ).toHaveBeenCalledWith(
          definition,
        );

        expect(
          read,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'applies a dynamic negative scale factor',
      async () => {

        const map =
          new DeviceRegisterMap();

        const valueDefinition =
          createDefinition(
            'Active Power',
            100,
            'activePowerScale',
          );

        const scaleDefinition =
          createDefinition(
            'Active Power Scale Factor',
            101,
          );

        map.add(
          'activePower',
          valueDefinition,
        );

        map.add(
          'activePowerScale',
          scaleDefinition,
        );

        const read =
          vi.fn(
            async (
              definition: RegisterDefinition,
            ) => {

              if (
                definition === valueDefinition
              ) {
                return 2300;
              }

              if (
                definition === scaleDefinition
              ) {
                return -1;
              }

              throw new Error(
                'Unexpected register definition.',
              );

            },
          );

        const reader =
          new DeviceReader(
            map,
            {
              read,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'activePower',
          ),
        ).resolves.toBe(
          230,
        );

        expect(
          read,
        ).toHaveBeenNthCalledWith(
          1,
          valueDefinition,
        );

        expect(
          read,
        ).toHaveBeenNthCalledWith(
          2,
          scaleDefinition,
        );

      },
    );

    it(
      'applies a dynamic positive scale factor',
      async () => {

        const map =
          new DeviceRegisterMap();

        const valueDefinition =
          createDefinition(
            'Energy',
            200,
            'energyScale',
          );

        const scaleDefinition =
          createDefinition(
            'Energy Scale Factor',
            201,
          );

        map.add(
          'energy',
          valueDefinition,
        );

        map.add(
          'energyScale',
          scaleDefinition,
        );

        const read =
          vi.fn(
            async (
              definition: RegisterDefinition,
            ) => {

              if (
                definition === valueDefinition
              ) {
                return 12;
              }

              return 2;

            },
          );

        const reader =
          new DeviceReader(
            map,
            {
              read,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'energy',
          ),
        ).resolves.toBe(
          1200,
        );

      },
    );

    it(
      'rejects dynamic scaling for non-numeric values',
      async () => {

        const map =
          new DeviceRegisterMap();

        const valueDefinition = {

          ...createDefinition(
            'Device Name',
            300,
            'deviceNameScale',
          ),

          dataType:
            RegisterDataType.String,

        };

        const scaleDefinition =
          createDefinition(
            'Device Name Scale',
            301,
          );

        map.add(
          'deviceName',
          valueDefinition,
        );

        map.add(
          'deviceNameScale',
          scaleDefinition,
        );

        const reader =
          new DeviceReader(
            map,
            {
              read:
                vi.fn(
                  async () => 'SolarEdge',
                ),
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'deviceName',
          ),
        ).rejects.toThrow(
          'Dynamic scaling requires a numeric value: deviceName',
        );

      },
    );

    it(
      'rejects non-numeric scale properties',
      async () => {

        const map =
          new DeviceRegisterMap();

        const valueDefinition =
          createDefinition(
            'Active Power',
            400,
            'activePowerScale',
          );

        const scaleDefinition = {

          ...createDefinition(
            'Active Power Scale',
            401,
          ),

          dataType:
            RegisterDataType.String,

        };

        map.add(
          'activePower',
          valueDefinition,
        );

        map.add(
          'activePowerScale',
          scaleDefinition,
        );

        const read =
          vi.fn(
            async (
              definition: RegisterDefinition,
            ) => {

              if (
                definition === valueDefinition
              ) {
                return 100;
              }

              return 'invalid';

            },
          );

        const reader =
          new DeviceReader(
            map,
            {
              read,
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'activePower',
          ),
        ).rejects.toThrow(
          'Scale property must contain a numeric value: activePowerScale',
        );

      },
    );

    it(
      'rejects self-referencing scale properties',
      async () => {

        const map =
          new DeviceRegisterMap();

        map.add(
          'power',
          createDefinition(
            'Power',
            500,
            'power',
          ),
        );

        const reader =
          new DeviceReader(
            map,
            {
              read:
                vi.fn(
                  async () => 100,
                ),
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'power',
          ),
        ).rejects.toThrow(
          'Register cannot reference itself as scale property: power',
        );

      },
    );

    it(
      'throws for unknown scale properties',
      async () => {

        const map =
          new DeviceRegisterMap();

        map.add(
          'power',
          createDefinition(
            'Power',
            600,
            'missingScale',
          ),
        );

        const reader =
          new DeviceReader(
            map,
            {
              read:
                vi.fn(
                  async () => 100,
                ),
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'power',
          ),
        ).rejects.toThrow(
          'Unknown device property: missingScale',
        );

      },
    );

    it(
      'throws for unknown properties',
      async () => {

        const reader =
          new DeviceReader(
            new DeviceRegisterMap(),
            {
              read: vi.fn(),
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'unknown',
          ),
        ).rejects.toThrow(
          'Unknown device property: unknown',
        );

      },
    );

  },
);