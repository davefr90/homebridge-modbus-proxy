import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { NameplateModel120 } from '../../src/sunspec/models/NameplateModel120.js';
import { NameplateModel120Register } from '../../src/sunspec/models/NameplateModel120Register.js';

describe(
  'NameplateModel120',
  () => {

    it(
      'creates SunSpec model 120',
      () => {

        const model =
          NameplateModel120.create();

        expect(
          model.id,
        ).toBe(
          120,
        );

        expect(
          model.name,
        ).toBe(
          'Nameplate Ratings',
        );

        expect(
          model.registerMap.size(),
        ).toBe(
          25,
        );

      },
    );

    it(
      'contains all expected properties',
      () => {

        const model =
          NameplateModel120.create();

        expect(
          model.registerMap.properties(),
        ).toEqual([
          'derType',

          'continuousActivePowerRatingScaleFactor',
          'continuousActivePowerRating',

          'continuousApparentPowerRatingScaleFactor',
          'continuousApparentPowerRating',

          'continuousReactivePowerScaleFactor',
          'continuousReactivePowerRatingQuadrant1',
          'continuousReactivePowerRatingQuadrant2',
          'continuousReactivePowerRatingQuadrant3',
          'continuousReactivePowerRatingQuadrant4',

          'maximumAcCurrentScaleFactor',
          'maximumAcCurrentRating',

          'minimumPowerFactorScaleFactor',
          'minimumPowerFactorQuadrant1',
          'minimumPowerFactorQuadrant2',
          'minimumPowerFactorQuadrant3',
          'minimumPowerFactorQuadrant4',

          'nominalEnergyScaleFactor',
          'nominalEnergyRating',

          'ampHourRatingScaleFactor',
          'ampHourRating',

          'maximumChargeRateScaleFactor',
          'maximumChargeRate',

          'maximumDischargeRateScaleFactor',
          'maximumDischargeRate',
        ]);

      },
    );

    it(
      'uses the correct model constants',
      () => {

        expect(
          NameplateModel120.MODEL_ID,
        ).toBe(
          120,
        );

        expect(
          NameplateModel120.DEFAULT_MODEL_START_ADDRESS,
        ).toBe(
          40070,
        );

      },
    );

    it(
      'defines the DER type',
      () => {

        const model =
          NameplateModel120.create();

        const definition =
          model.registerMap.get(
            'derType',
          );

        expect(
          definition.address,
        ).toBe(
          40072
          + NameplateModel120Register.DER_TYPE,
        );

        expect(
          definition.address,
        ).toBe(
          40072,
        );

        expect(
          definition.length,
        ).toBe(
          1,
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
        'continuousActivePowerRating',
        40073,
        'continuousActivePowerRatingScaleFactor',
        'W',
      ],
      [
        'continuousApparentPowerRating',
        40075,
        'continuousApparentPowerRatingScaleFactor',
        'VA',
      ],
      [
        'maximumAcCurrentRating',
        40082,
        'maximumAcCurrentScaleFactor',
        'A',
      ],
      [
        'maximumChargeRate',
        40093,
        'maximumChargeRateScaleFactor',
        'W',
      ],
      [
        'maximumDischargeRate',
        40095,
        'maximumDischargeRateScaleFactor',
        'W',
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
          NameplateModel120.create();

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

    it.each([
      [
        'continuousReactivePowerRatingQuadrant1',
        40077,
      ],
      [
        'continuousReactivePowerRatingQuadrant2',
        40078,
      ],
      [
        'continuousReactivePowerRatingQuadrant3',
        40079,
      ],
      [
        'continuousReactivePowerRatingQuadrant4',
        40080,
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
      ) => {

        const model =
          NameplateModel120.create();

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
          RegisterDataType.Int16,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          'continuousReactivePowerScaleFactor',
        );

        expect(
          definition.unit,
        ).toBe(
          'var',
        );

      },
    );

    it.each([
      [
        'minimumPowerFactorQuadrant1',
        40084,
      ],
      [
        'minimumPowerFactorQuadrant2',
        40085,
      ],
      [
        'minimumPowerFactorQuadrant3',
        40086,
      ],
      [
        'minimumPowerFactorQuadrant4',
        40087,
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
      ) => {

        const model =
          NameplateModel120.create();

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
          RegisterDataType.Int16,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          'minimumPowerFactorScaleFactor',
        );

      },
    );

    it(
      'defines the nominal energy rating',
      () => {

        const model =
          NameplateModel120.create();

        const definition =
          model.registerMap.get(
            'nominalEnergyRating',
          );

        expect(
          definition.address,
        ).toBe(
          40089,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Uint32,
        );

        expect(
          definition.length,
        ).toBe(
          2,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          'nominalEnergyScaleFactor',
        );

        expect(
          definition.unit,
        ).toBe(
          'Wh',
        );

      },
    );

    it(
      'defines the amp-hour rating',
      () => {

        const model =
          NameplateModel120.create();

        const definition =
          model.registerMap.get(
            'ampHourRating',
          );

        expect(
          definition.address,
        ).toBe(
          40091,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Uint32,
        );

        expect(
          definition.length,
        ).toBe(
          2,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          'ampHourRatingScaleFactor',
        );

        expect(
          definition.unit,
        ).toBe(
          'Ah',
        );

      },
    );

    it.each([
      [
        'continuousActivePowerRatingScaleFactor',
        40074,
      ],
      [
        'continuousApparentPowerRatingScaleFactor',
        40076,
      ],
      [
        'continuousReactivePowerScaleFactor',
        40081,
      ],
      [
        'maximumAcCurrentScaleFactor',
        40083,
      ],
      [
        'minimumPowerFactorScaleFactor',
        40088,
      ],
      [
        'nominalEnergyScaleFactor',
        40090,
      ],
      [
        'ampHourRatingScaleFactor',
        40092,
      ],
      [
        'maximumChargeRateScaleFactor',
        40094,
      ],
      [
        'maximumDischargeRateScaleFactor',
        40096,
      ],
    ])(
      'defines scale factor %s at address %s',
      (
        property,
        address,
      ) => {

        const model =
          NameplateModel120.create();

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
          definition.length,
        ).toBe(
          1,
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
          NameplateModel120.create(
            15,
          );

        for (
          const definition
          of model.registerMap.definitions()
        ) {
          expect(
            definition.unitId,
          ).toBe(
            15,
          );
        }

      },
    );

    it(
      'uses a custom model start address',
      () => {

        const model =
          NameplateModel120.create(
            1,
            50000,
          );

        expect(
          model.registerMap
            .get(
              'derType',
            )
            .address,
        ).toBe(
          50002,
        );

        expect(
          model.registerMap
            .get(
              'continuousActivePowerRating',
            )
            .address,
        ).toBe(
          50003,
        );

        expect(
          model.registerMap
            .get(
              'maximumDischargeRate',
            )
            .address,
        ).toBe(
          50025,
        );

      },
    );

    it.each([
      -1,
      1.5,
      65510,
    ])(
      'rejects invalid model start address %s',
      (
        modelStartAddress,
      ) => {

        expect(
          () =>
            NameplateModel120.create(
              1,
              modelStartAddress,
            ),
        ).toThrow(
          `Invalid SunSpec model start address: ${modelStartAddress}`,
        );

      },
    );

  },
);