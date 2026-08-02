import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  MeterApi,
} from '../../../src/sunspec/api/MeterApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

import {
  SunSpecProperty,
} from '../../../src/sunspec/SunSpecProperty.js';

/**
 * Creates a Meter API with a reader returning zero
 * for every unmocked property.
 */
function createMeterApi():
  MeterApi {

  const reader = {
    read:
      vi.fn()
        .mockResolvedValue(
          0,
        ),

    readMany:
      vi.fn(
        async (
          properties: readonly string[],
        ) =>
          Object.fromEntries(
            properties.map(
              (property) => [
                property,
                0,
              ],
            ),
          ),
      ),

    write:
      vi.fn(),
  } as unknown as SunSpecPropertyReader;

  return new MeterApi(
    reader,
  );

}

describe(
  'MeterApi',
  () => {

    it(
      'converts negative active power into grid import power',
      async () => {

        const api =
          createMeterApi();

        const activePower =
          vi.spyOn(
            api,
            'activePower',
          ).mockResolvedValue(
            -2350.6,
          );

        await expect(
          api.importPower(),
        ).resolves.toBe(
          2350.6,
        );

        await expect(
          api.exportPower(),
        ).resolves.toBe(
          0,
        );

        expect(
          activePower,
        ).toHaveBeenCalledTimes(
          2,
        );

      },
    );

    it(
      'converts positive active power into grid export power',
      async () => {

        const api =
          createMeterApi();

        const activePower =
          vi.spyOn(
            api,
            'activePower',
          ).mockResolvedValue(
            4100.5,
          );

        await expect(
          api.importPower(),
        ).resolves.toBe(
          0,
        );

        await expect(
          api.exportPower(),
        ).resolves.toBe(
          4100.5,
        );

        expect(
          activePower,
        ).toHaveBeenCalledTimes(
          2,
        );

      },
    );

    it(
      'returns zero import and export power when active power is zero',
      async () => {

        const api =
          createMeterApi();

        const activePower =
          vi.spyOn(
            api,
            'activePower',
          ).mockResolvedValue(
            0,
          );

        await expect(
          api.importPower(),
        ).resolves.toBe(
          0,
        );

        await expect(
          api.exportPower(),
        ).resolves.toBe(
          0,
        );

        expect(
          activePower,
        ).toHaveBeenCalledTimes(
          2,
        );

      },
    );

    it(
      'returns a snapshot from one multi-property read',
      async () => {

        const read =
          vi.fn()
            .mockResolvedValue(
              0,
            );

        const readMany =
          vi.fn(
            async (
              properties: readonly string[],
            ) =>
              Object.fromEntries(
                properties.map(
                  (property) => [
                    property,

                    property ===
                      SunSpecProperty.Meter.ActivePower
                      ? -2350.6
                      : 0,
                  ],
                ),
              ),
          );

        const api =
          new MeterApi(
            {
              read,
              readMany,
              write: vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        const snapshot =
          await api.snapshot();

        expect(
          snapshot,
        ).toEqual({
          current: 0,
          currentA: 0,
          currentB: 0,
          currentC: 0,
          voltageLineNeutral: 0,
          voltageAN: 0,
          voltageBN: 0,
          voltageCN: 0,
          voltageLineLine: 0,
          voltageAB: 0,
          voltageBC: 0,
          voltageCA: 0,
          frequency: 0,
          activePower: -2350.6,
          importPower: 2350.6,
          exportPower: 0,
          activePowerA: 0,
          activePowerB: 0,
          activePowerC: 0,
          apparentPower: 0,
          apparentPowerA: 0,
          apparentPowerB: 0,
          apparentPowerC: 0,
          reactivePower: 0,
          reactivePowerA: 0,
          reactivePowerB: 0,
          reactivePowerC: 0,
          powerFactor: 0,
          powerFactorA: 0,
          powerFactorB: 0,
          powerFactorC: 0,
          exportedEnergy: 0,
          importedEnergy: 0,
          events: 0,
        });

        expect(
          read,
        ).not.toHaveBeenCalled();

        expect(
          readMany,
        ).toHaveBeenCalledTimes(
          1,
        );

        const requestedProperties =
          readMany.mock.calls[0]?.[0];

        expect(
          requestedProperties,
        ).toHaveLength(
          32,
        );

        expect(
          new Set(
            requestedProperties,
          ).size,
        ).toBe(
          32,
        );

      },
    );

  },
);
