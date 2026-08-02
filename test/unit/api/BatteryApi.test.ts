import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  BatteryApi,
} from '../../../src/sunspec/api/BatteryApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

import {
  SunSpecProperty,
} from '../../../src/sunspec/SunSpecProperty.js';

/**
 * Creates one complete mocked Battery 1 property set.
 */
function createSnapshotValues(
  power: number | undefined,
) {

  return {
    [SunSpecProperty.Battery.Manufacturer]:
      '48V_BYD',

    [SunSpecProperty.Battery.Model]:
      'BYD Premium LVS 16.0',

    [SunSpecProperty.Battery.FirmwareVersion]:
      '1.0',

    [SunSpecProperty.Battery.SerialNumber]:
      'BATTERY-1',

    [SunSpecProperty.Battery.DeviceId]:
      24,

    [SunSpecProperty.Battery.RatedEnergy]:
      16000,

    [SunSpecProperty.Battery.MaximumChargeContinuousPower]:
      5000,

    [SunSpecProperty.Battery.MaximumDischargeContinuousPower]:
      5000,

    [SunSpecProperty.Battery.MaximumChargePeakPower]:
      6000,

    [SunSpecProperty.Battery.MaximumDischargePeakPower]:
      6000,

    [SunSpecProperty.Battery.AverageTemperature]:
      24.5,

    [SunSpecProperty.Battery.MaximumTemperature]:
      27,

    [SunSpecProperty.Battery.Voltage]:
      50.4,

    [SunSpecProperty.Battery.Current]:
      -5.83,

    [SunSpecProperty.Battery.Power]:
      power,

    [SunSpecProperty.Battery.MaximumEnergy]:
      15500,

    [SunSpecProperty.Battery.AvailableEnergy]:
      15190,

    [SunSpecProperty.Battery.StateOfHealth]:
      96.875,

    [SunSpecProperty.Battery.StateOfEnergy]:
      98,

    [SunSpecProperty.Battery.Status]:
      4,

    [SunSpecProperty.Battery.StatusInternal]:
      0,
  };

}

describe(
  'BatteryApi',
  () => {

    it(
      'returns a snapshot and derives discharging power',
      async () => {

        const read =
          vi.fn();

        const readMany =
          vi.fn()
            .mockResolvedValue(
              createSnapshotValues(
                -294,
              ),
            );

        const api =
          new BatteryApi(
            {
              read,
              readMany,
              write:
                vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        await expect(
          api.snapshot(),
        ).resolves.toMatchObject({
          manufacturer:
            '48V_BYD',
          model:
            'BYD Premium LVS 16.0',
          power:
            -294,
          chargePower:
            0,
          dischargePower:
            294,
          stateOfEnergy:
            98,
          status:
            4,
        });

        expect(
          read,
        ).not.toHaveBeenCalled();

        expect(
          readMany,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          readMany,
        ).toHaveBeenCalledWith([
          SunSpecProperty.Battery.Manufacturer,
          SunSpecProperty.Battery.Model,
          SunSpecProperty.Battery.FirmwareVersion,
          SunSpecProperty.Battery.SerialNumber,
          SunSpecProperty.Battery.DeviceId,
          SunSpecProperty.Battery.RatedEnergy,
          SunSpecProperty.Battery.MaximumChargeContinuousPower,
          SunSpecProperty.Battery.MaximumDischargeContinuousPower,
          SunSpecProperty.Battery.MaximumChargePeakPower,
          SunSpecProperty.Battery.MaximumDischargePeakPower,
          SunSpecProperty.Battery.AverageTemperature,
          SunSpecProperty.Battery.MaximumTemperature,
          SunSpecProperty.Battery.Voltage,
          SunSpecProperty.Battery.Current,
          SunSpecProperty.Battery.Power,
          SunSpecProperty.Battery.MaximumEnergy,
          SunSpecProperty.Battery.AvailableEnergy,
          SunSpecProperty.Battery.StateOfHealth,
          SunSpecProperty.Battery.StateOfEnergy,
          SunSpecProperty.Battery.Status,
          SunSpecProperty.Battery.StatusInternal,
        ]);

      },
    );

    it(
      'derives charging power from a positive signed value',
      async () => {

        const api =
          new BatteryApi(
            {
              read:
                vi.fn(),
              readMany:
                vi.fn()
                  .mockResolvedValue(
                    createSnapshotValues(
                      1250,
                    ),
                  ),
              write:
                vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        await expect(
          api.snapshot(),
        ).resolves.toMatchObject({
          power:
            1250,
          chargePower:
            1250,
          dischargePower:
            0,
        });

      },
    );

    it(
      'preserves an unavailable signed power value',
      async () => {

        const api =
          new BatteryApi(
            {
              read:
                vi.fn(),
              readMany:
                vi.fn()
                  .mockResolvedValue(
                    createSnapshotValues(
                      undefined,
                    ),
                  ),
              write:
                vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        await expect(
          api.snapshot(),
        ).resolves.toMatchObject({
          power:
            undefined,
          chargePower:
            undefined,
          dischargePower:
            undefined,
        });

      },
    );

  },
);
