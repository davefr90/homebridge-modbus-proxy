import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  NameplateApi,
} from '../../../src/sunspec/api/NameplateApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

describe(
  'NameplateApi',
  () => {

    it(
      'returns a snapshot containing all exposed nameplate properties',
      async () => {

        const reader = {
          read: vi.fn(),
          write: vi.fn(),
        } as unknown as SunSpecPropertyReader;

        const api = new NameplateApi(
          reader,
        );

        vi.spyOn(
          api,
          'maximumPower',
        ).mockResolvedValue(
          8000,
        );

        vi.spyOn(
          api,
          'maximumCurrent',
        ).mockResolvedValue(
          12.5,
        );

        vi.spyOn(
          api,
          'maximumVoltage',
        ).mockResolvedValue(
          1000,
        );

        const snapshot = await api.snapshot();

        expect(
          snapshot,
        ).toEqual({
          maximumPower: 8000,
          maximumCurrent: 12.5,
          maximumVoltage: 1000,
        });

      },
    );

  },
);