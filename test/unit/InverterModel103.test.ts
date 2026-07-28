import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { InverterModel103 } from '../../src/sunspec/models/InverterModel103.js';
import { InverterModel103Register } from '../../src/sunspec/models/InverterModel103Register.js';

describe(
  'InverterModel103',
  () => {

    it(
      'creates SunSpec inverter model 103',
      () => {

        const model =
          InverterModel103.create();

        expect(
          model.id,
        ).toBe(
          103,
        );

        expect(
          model.name,
        ).toBe(
          'Three-Phase Inverter',
        );

        expect(
          model.registerMap.size(),
        ).toBe(
          5,
        );

      },
    );

    it(
      'contains the AC-current properties',
      () => {

        const model =
          InverterModel103.create();

        expect(
          model.registerMap.properties(),
        ).toEqual([
          'acCurrentScaleFactor',
          'acCurrent',
          'acCurrentPhaseA',
          'acCurrentPhaseB',
          'acCurrentPhaseC',
        ]);

      },
    );

    it(
      'defines the AC-current scale factor',
      () => {

        const model =
          InverterModel103.create();

        const definition =
          model.registerMap.get(
            'acCurrentScaleFactor',
          );

        expect(
          definition.address,
        ).toBe(
          40072
          + InverterModel103Register
            .AC_CURRENT_SCALE_FACTOR,
        );

        expect(
          definition.address,
        ).toBe(
          40076,
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
      'defines the total AC current',
      () => {

        const model =
          InverterModel103.create();

        const definition =
          model.registerMap.get(
            'acCurrent',
          );

        expect(
          definition.address,
        ).toBe(
          40072,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Uint16,
        );

        expect(
          definition.scaleProperty,
        ).toBe(
          'acCurrentScaleFactor',
        );

        expect(
          definition.unit,
        ).toBe(
          'A',
        );

      },
    );

    it.each([
      [
        'acCurrentPhaseA',
        40073,
      ],
      [
        'acCurrentPhaseB',
        40074,
      ],
      [
        'acCurrentPhaseC',
        40075,
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
      ) => {

        const model =
          InverterModel103.create();

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
          'acCurrentScaleFactor',
        );

        expect(
          definition.unit,
        ).toBe(
          'A',
        );

      },
    );

    it(
      'uses a custom Modbus unit id',
      () => {

        const model =
          InverterModel103.create(
            7,
          );

        for (
          const definition
          of model.registerMap.definitions()
        ) {
          expect(
            definition.unitId,
          ).toBe(
            7,
          );
        }

      },
    );

    it(
      'uses a custom model start address',
      () => {

        const model =
          InverterModel103.create(
            1,
            50000,
          );

        expect(
          model.registerMap
            .get(
              'acCurrent',
            )
            .address,
        ).toBe(
          50002,
        );

        expect(
          model.registerMap
            .get(
              'acCurrentScaleFactor',
            )
            .address,
        ).toBe(
          50006,
        );

      },
    );

    it.each([
      -1,
      1.5,
      65530,
    ])(
      'rejects invalid model start address %s',
      (
        modelStartAddress,
      ) => {

        expect(
          () =>
            InverterModel103.create(
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