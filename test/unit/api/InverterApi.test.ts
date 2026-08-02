import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  InverterApi,
} from '../../../src/sunspec/api/InverterApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

import {
  SunSpecProperty,
} from '../../../src/sunspec/SunSpecProperty.js';

describe(
  'InverterApi',
  () => {

    it(
      'returns all properties from one optimized snapshot read',
      async () => {

        const read =
          vi.fn();

        const readMany =
          vi.fn()
            .mockResolvedValue({
              [SunSpecProperty.Inverter.AcCurrent]:
                12.3,

              [SunSpecProperty.Inverter.AcCurrentA]:
                4.1,

              [SunSpecProperty.Inverter.AcCurrentB]:
                4.2,

              [SunSpecProperty.Inverter.AcCurrentC]:
                4.0,

              [SunSpecProperty.Inverter.AcVoltageAB]:
                400.1,

              [SunSpecProperty.Inverter.AcVoltageBC]:
                399.8,

              [SunSpecProperty.Inverter.AcVoltageCA]:
                400.3,

              [SunSpecProperty.Inverter.AcVoltageAN]:
                230.4,

              [SunSpecProperty.Inverter.AcVoltageBN]:
                230.1,

              [SunSpecProperty.Inverter.AcVoltageCN]:
                230.5,

              [SunSpecProperty.Inverter.AcPower]:
                7250,

              [SunSpecProperty.Inverter.Frequency]:
                50.01,

              [SunSpecProperty.Inverter.ApparentPower]:
                7310,

              [SunSpecProperty.Inverter.ReactivePower]:
                320,

              [SunSpecProperty.Inverter.PowerFactor]:
                99.2,

              [SunSpecProperty.Inverter.DcCurrent]:
                11.8,

              [SunSpecProperty.Inverter.DcVoltage]:
                680.5,

              [SunSpecProperty.Inverter.DcPower]:
                8030,

              [SunSpecProperty.Inverter.Temperature]:
                42.7,

              [SunSpecProperty.Inverter.Status]:
                4,
            });

        const api =
          new InverterApi(
            {
              read,
              readMany,
              write:
                vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        await expect(
          api.snapshot(),
        ).resolves.toEqual({
          acCurrent: 12.3,
          acCurrentA: 4.1,
          acCurrentB: 4.2,
          acCurrentC: 4.0,
          acVoltageAB: 400.1,
          acVoltageBC: 399.8,
          acVoltageCA: 400.3,
          acVoltageAN: 230.4,
          acVoltageBN: 230.1,
          acVoltageCN: 230.5,
          acPower: 7250,
          frequency: 50.01,
          apparentPower: 7310,
          reactivePower: 320,
          powerFactor: 99.2,
          dcCurrent: 11.8,
          dcVoltage: 680.5,
          dcPower: 8030,
          temperature: 42.7,
          status: 4,
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
          SunSpecProperty.Inverter.AcCurrent,
          SunSpecProperty.Inverter.AcCurrentA,
          SunSpecProperty.Inverter.AcCurrentB,
          SunSpecProperty.Inverter.AcCurrentC,
          SunSpecProperty.Inverter.AcVoltageAB,
          SunSpecProperty.Inverter.AcVoltageBC,
          SunSpecProperty.Inverter.AcVoltageCA,
          SunSpecProperty.Inverter.AcVoltageAN,
          SunSpecProperty.Inverter.AcVoltageBN,
          SunSpecProperty.Inverter.AcVoltageCN,
          SunSpecProperty.Inverter.AcPower,
          SunSpecProperty.Inverter.Frequency,
          SunSpecProperty.Inverter.ApparentPower,
          SunSpecProperty.Inverter.ReactivePower,
          SunSpecProperty.Inverter.PowerFactor,
          SunSpecProperty.Inverter.DcCurrent,
          SunSpecProperty.Inverter.DcVoltage,
          SunSpecProperty.Inverter.DcPower,
          SunSpecProperty.Inverter.Temperature,
          SunSpecProperty.Inverter.Status,
        ]);

      },
    );

  },
);
