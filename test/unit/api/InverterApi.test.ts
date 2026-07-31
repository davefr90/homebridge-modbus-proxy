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

describe(
  'InverterApi',
  () => {

    it(
      'returns a snapshot containing all exposed inverter properties',
      async () => {

        const reader = {
          read: vi.fn(),
          write: vi.fn(),
        } as unknown as SunSpecPropertyReader;

        const api = new InverterApi(
          reader,
        );

        vi.spyOn(
          api,
          'acCurrent',
        ).mockResolvedValue(
          12.3,
        );

        vi.spyOn(
          api,
          'acCurrentA',
        ).mockResolvedValue(
          4.1,
        );

        vi.spyOn(
          api,
          'acCurrentB',
        ).mockResolvedValue(
          4.2,
        );

        vi.spyOn(
          api,
          'acCurrentC',
        ).mockResolvedValue(
          4.0,
        );

        vi.spyOn(
          api,
          'acVoltageAB',
        ).mockResolvedValue(
          400.1,
        );

        vi.spyOn(
          api,
          'acVoltageBC',
        ).mockResolvedValue(
          399.8,
        );

        vi.spyOn(
          api,
          'acVoltageCA',
        ).mockResolvedValue(
          400.3,
        );

        vi.spyOn(
          api,
          'acVoltageAN',
        ).mockResolvedValue(
          230.4,
        );

        vi.spyOn(
          api,
          'acVoltageBN',
        ).mockResolvedValue(
          230.1,
        );

        vi.spyOn(
          api,
          'acVoltageCN',
        ).mockResolvedValue(
          230.5,
        );

        vi.spyOn(
          api,
          'acPower',
        ).mockResolvedValue(
          7250,
        );

        vi.spyOn(
          api,
          'frequency',
        ).mockResolvedValue(
          50.01,
        );

        vi.spyOn(
          api,
          'apparentPower',
        ).mockResolvedValue(
          7310,
        );

        vi.spyOn(
          api,
          'reactivePower',
        ).mockResolvedValue(
          320,
        );

        vi.spyOn(
          api,
          'powerFactor',
        ).mockResolvedValue(
          99.2,
        );

        vi.spyOn(
          api,
          'dcCurrent',
        ).mockResolvedValue(
          11.8,
        );

        vi.spyOn(
          api,
          'dcVoltage',
        ).mockResolvedValue(
          680.5,
        );

        vi.spyOn(
          api,
          'dcPower',
        ).mockResolvedValue(
          8030,
        );

        vi.spyOn(
          api,
          'temperature',
        ).mockResolvedValue(
          42.7,
        );

        vi.spyOn(
          api,
          'status',
        ).mockResolvedValue(
          4,
        );

        const snapshot = await api.snapshot();

        expect(
          snapshot,
        ).toEqual({
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

      },
    );

  },
);