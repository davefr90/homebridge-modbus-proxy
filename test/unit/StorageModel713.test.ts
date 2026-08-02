import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  StorageModel713,
} from '../../src/sunspec/models/StorageModel713.js';

describe(
  'StorageModel713',
  () => {

    const unitId =
      2;

    const modelStartAddress =
      41264;

    it(
      'creates the DER Storage Capacity model',
      () => {

        const model =
          StorageModel713.create(
            unitId,
            modelStartAddress,
          );

        expect(
          model.id,
        ).toBe(
          713,
        );

        expect(
          model.name,
        ).toBe(
          'DER Storage Capacity',
        );

        expect(
          model.registerMap.size(),
        ).toBe(
          7,
        );

      },
    );

    it.each([
      [
        'energyRating',
        41266,
        'energyScaleFactor',
        'Wh',
      ],
      [
        'energyAvailable',
        41267,
        'energyScaleFactor',
        'Wh',
      ],
      [
        'stateOfCharge',
        41268,
        'percentageScaleFactor',
        '%',
      ],
      [
        'stateOfHealth',
        41269,
        'percentageScaleFactor',
        '%',
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
        scaleProperty,
        unit,
      ) => {

        const model =
          StorageModel713.create(
            unitId,
            modelStartAddress,
          );

        const definition =
          model.registerMap.get(
            property,
          );

        expect(
          definition.address,
        ).toBe(
          address,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Uint16,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          scaleProperty,
        );

        expect(
          definition.unit,
        ).toBe(
          unit,
        );

      },
    );

    it(
      'defines the storage status',
      () => {

        const definition =
          StorageModel713
            .create(
              unitId,
              modelStartAddress,
            )
            .registerMap
            .get(
              'status',
            );

        expect(
          definition.address,
        ).toBe(
          41270,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Uint16,
        );

        expect(
          definition.scaleProperty,
        ).toBeUndefined();

      },
    );

    it.each([
      [
        'energyScaleFactor',
        41271,
      ],
      [
        'percentageScaleFactor',
        41272,
      ],
    ])(
      'defines scale factor %s at address %s',
      (
        property,
        address,
      ) => {

        const definition =
          StorageModel713
            .create(
              unitId,
              modelStartAddress,
            )
            .registerMap
            .get(
              property,
            );

        expect(
          definition.address,
        ).toBe(
          address,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Int16,
        );

        expect(
          definition.scaleProperty,
        ).toBeUndefined();

      },
    );

    it(
      'uses a custom Modbus unit id',
      () => {

        const model =
          StorageModel713.create(
            3,
            41090,
          );

        for (
          const definition
          of model.registerMap.definitions()
        ) {
          expect(
            definition.unitId,
          ).toBe(
            3,
          );
        }

      },
    );

    it(
      'uses a custom model start address',
      () => {

        const model =
          StorageModel713.create(
            1,
            50000,
          );

        expect(
          model.registerMap
            .get(
              'energyRating',
            )
            .address,
        ).toBe(
          50002,
        );

        expect(
          model.registerMap
            .get(
              'percentageScaleFactor',
            )
            .address,
        ).toBe(
          50008,
        );

      },
    );

    it.each([
      -1,
      1.5,
      65528,
    ])(
      'rejects invalid model start address %s',
      (
        invalidAddress,
      ) => {

        expect(
          () =>
            StorageModel713.create(
              unitId,
              invalidAddress,
            ),
        ).toThrow(
          `Invalid SunSpec model start address: ${invalidAddress}`,
        );

      },
    );

  },
);
