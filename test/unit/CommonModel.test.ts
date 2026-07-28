import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { CommonModel } from '../../src/sunspec/models/CommonModel.js';

describe(
  'CommonModel',
  () => {

    it(
      'creates SunSpec Common Model 1',
      () => {

        const model =
          CommonModel.create();

        expect(
          model.id,
        ).toBe(
          1,
        );

        expect(
          model.name,
        ).toBe(
          'Common',
        );

        expect(
          model.registerMap.size(),
        ).toBe(
          6,
        );

      },
    );

    it(
      'contains all Common Model properties',
      () => {

        const model =
          CommonModel.create();

        expect(
          model.registerMap.properties(),
        ).toEqual([
          'manufacturer',
          'model',
          'options',
          'version',
          'serialNumber',
          'deviceAddress',
        ]);

      },
    );

    it(
      'defines the manufacturer register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'manufacturer',
          );

        expect(
          definition.unitId,
        ).toBe(
          1,
        );

        expect(
          definition.address,
        ).toBe(
          40004,
        );

        expect(
          definition.length,
        ).toBe(
          16,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.String,
        );

        expect(
          definition.name,
        ).toBe(
          'Manufacturer',
        );

      },
    );

    it(
      'defines the model register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'model',
          );

        expect(
          definition.address,
        ).toBe(
          40020,
        );

        expect(
          definition.length,
        ).toBe(
          16,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.String,
        );

      },
    );

    it(
      'defines the options register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'options',
          );

        expect(
          definition.address,
        ).toBe(
          40036,
        );

        expect(
          definition.length,
        ).toBe(
          8,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.String,
        );

      },
    );

    it(
      'defines the version register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'version',
          );

        expect(
          definition.address,
        ).toBe(
          40044,
        );

        expect(
          definition.length,
        ).toBe(
          8,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.String,
        );

      },
    );

    it(
      'defines the serial number register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'serialNumber',
          );

        expect(
          definition.address,
        ).toBe(
          40052,
        );

        expect(
          definition.length,
        ).toBe(
          16,
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.String,
        );

      },
    );

    it(
      'defines the device address register',
      () => {

        const model =
          CommonModel.create();

        const definition =
          model.registerMap.get(
            'deviceAddress',
          );

        expect(
          definition.address,
        ).toBe(
          40068,
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

      },
    );

    it(
      'uses a custom Modbus unit id',
      () => {

        const model =
          CommonModel.create(
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
      'uses a custom SunSpec base address',
      () => {

        const model =
          CommonModel.create(
            1,
            50000,
          );

        expect(
          model.registerMap
            .get(
              'manufacturer',
            )
            .address,
        ).toBe(
          50004,
        );

        expect(
          model.registerMap
            .get(
              'deviceAddress',
            )
            .address,
        ).toBe(
          50068,
        );

      },
    );

    it.each([
      -1,
      1.5,
      65468,
    ])(
      'rejects invalid base address %s',
      (
        baseAddress,
      ) => {

        expect(
          () =>
            CommonModel.create(
              1,
              baseAddress,
            ),
        ).toThrow(
          `Invalid SunSpec base address: ${baseAddress}`,
        );

      },
    );

  },
);