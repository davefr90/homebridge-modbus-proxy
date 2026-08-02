import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  SunSpecDiscoveryResult,
} from '../../src/sunspec/discovery/SunSpecDiscoveryResult.js';

import {
  StorageModel713,
} from '../../src/sunspec/models/StorageModel713.js';

import {
  SunSpecDeviceFactory,
} from '../../src/sunspec/SunSpecDeviceFactory.js';

describe(
  'SunSpec storage factory support',
  () => {

    it(
      'creates Model 713 from its discovered address',
      () => {

        const headerAddress =
          41264;

        const result =
          new SunSpecDiscoveryResult(
            2,
            40000,
            [
              {
                id:
                  StorageModel713.MODEL_ID,
                headerAddress,
                dataAddress:
                  headerAddress + 2,
                length:
                  StorageModel713.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.hasModel(
            StorageModel713.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.model(
            StorageModel713.MODEL_ID,
          ).name,
        ).toBe(
          'DER Storage Capacity',
        );

        expect(
          device.model(
            StorageModel713.MODEL_ID,
          ).registerMap.get(
            'energyRating',
          ).address,
        ).toBe(
          41266,
        );

        expect(
          device.storage,
        ).toBeDefined();

      },
    );

    it(
      'rejects an invalid Model 713 length',
      () => {

        const invalidLength =
          StorageModel713.MODEL_LENGTH + 1;

        const result =
          new SunSpecDiscoveryResult(
            2,
            40000,
            [
              {
                id:
                  StorageModel713.MODEL_ID,
                headerAddress:
                  41264,
                dataAddress:
                  41266,
                length:
                  invalidLength,
              },
            ],
          );

        expect(
          () =>
            SunSpecDeviceFactory.create(
              result,
            ),
        ).toThrow(
          'Invalid length for SunSpec model ' +
          `${StorageModel713.MODEL_ID}: expected ` +
          `${StorageModel713.MODEL_LENGTH}, received ` +
          `${invalidLength}.`,
        );

      },
    );

  },
);
