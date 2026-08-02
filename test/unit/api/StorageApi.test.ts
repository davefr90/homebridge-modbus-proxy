import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  StorageApi,
} from '../../../src/sunspec/api/StorageApi.js';

import type {
  SunSpecPropertyReader,
} from '../../../src/sunspec/api/SunSpecPropertyReader.js';

import {
  SunSpecProperty,
} from '../../../src/sunspec/SunSpecProperty.js';

describe(
  'StorageApi',
  () => {

    it(
      'returns a storage snapshot from one multi-property read',
      async () => {

        const read =
          vi.fn();

        const snapshotValues = {
          [SunSpecProperty.Storage.EnergyRating]:
            34800,

          [SunSpecProperty.Storage.EnergyAvailable]:
            30972,

          [SunSpecProperty.Storage.StateOfCharge]:
            89,

          [SunSpecProperty.Storage.StateOfHealth]:
            100,

          [SunSpecProperty.Storage.Status]:
            0,
        };

        const readMany =
          vi.fn()
            .mockResolvedValue(
              snapshotValues,
            );

        const api =
          new StorageApi(
            {
              read,
              readMany,
              write: vi.fn(),
            } as unknown as SunSpecPropertyReader,
          );

        await expect(
          api.snapshot(),
        ).resolves.toEqual({
          energyRating: 34800,
          energyAvailable: 30972,
          stateOfCharge: 89,
          stateOfHealth: 100,
          status: 0,
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
          SunSpecProperty.Storage.EnergyRating,
          SunSpecProperty.Storage.EnergyAvailable,
          SunSpecProperty.Storage.StateOfCharge,
          SunSpecProperty.Storage.StateOfHealth,
          SunSpecProperty.Storage.Status,
        ]);

      },
    );

  },
);
