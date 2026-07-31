import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  CommonApi,
} from '../../../src/sunspec/api/CommonApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

describe(
  'CommonApi',
  () => {

    it(
      'returns a snapshot containing all exposed common properties',
      async () => {

        const reader = {
          read: vi.fn(),
          write: vi.fn(),
        } as unknown as SunSpecPropertyReader;

        const api = new CommonApi(
          reader,
        );

        vi.spyOn(
          api,
          'manufacturer',
        ).mockResolvedValue(
          'SolarEdge',
        );

        vi.spyOn(
          api,
          'modelName',
        ).mockResolvedValue(
          'SE8K-RWS',
        );

        vi.spyOn(
          api,
          'options',
        ).mockResolvedValue(
          'SolarEdge Modbus TCP',
        );

        vi.spyOn(
          api,
          'version',
        ).mockResolvedValue(
          '4.20.36',
        );

        vi.spyOn(
          api,
          'serialNumber',
        ).mockResolvedValue(
          '7E123456-78',
        );

        vi.spyOn(
          api,
          'deviceAddress',
        ).mockResolvedValue(
          1,
        );

        const snapshot = await api.snapshot();

        expect(
          snapshot,
        ).toEqual({
          manufacturer: 'SolarEdge',
          model: 'SE8K-RWS',
          options: 'SolarEdge Modbus TCP',
          version: '4.20.36',
          serialNumber: '7E123456-78',
          deviceAddress: 1,
        });

      },
    );

  },
);