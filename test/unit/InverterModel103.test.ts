import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  InverterModel103,
} from '../../src/sunspec/models/InverterModel103.js';

describe(
  'InverterModel103',
  () => {

    it(
      'creates the complete exposed SunSpec inverter model',
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
          31,
        );

        expect(
          model.registerMap.properties(),
        ).toEqual([
          'acCurrentScaleFactor',
          'acCurrent',
          'acCurrentA',
          'acCurrentB',
          'acCurrentC',
          'acVoltageScaleFactor',
          'acVoltageAB',
          'acVoltageBC',
          'acVoltageCA',
          'acVoltageAN',
          'acVoltageBN',
          'acVoltageCN',
          'acPowerScaleFactor',
          'acPower',
          'frequencyScaleFactor',
          'frequency',
          'apparentPowerScaleFactor',
          'apparentPower',
          'reactivePowerScaleFactor',
          'reactivePower',
          'powerFactorScaleFactor',
          'powerFactor',
          'dcCurrentScaleFactor',
          'dcCurrent',
          'dcVoltageScaleFactor',
          'dcVoltage',
          'dcPowerScaleFactor',
          'dcPower',
          'temperatureScaleFactor',
          'temperature',
          'status',
        ]);

      },
    );

    it.each([
      [
        'acCurrent',
        40072,
        RegisterDataType.Uint16,
        'acCurrentScaleFactor',
        'A',
      ],
      [
        'acCurrentA',
        40073,
        RegisterDataType.Uint16,
        'acCurrentScaleFactor',
        'A',
      ],
      [
        'acCurrentB',
        40074,
        RegisterDataType.Uint16,
        'acCurrentScaleFactor',
        'A',
      ],
      [
        'acCurrentC',
        40075,
        RegisterDataType.Uint16,
        'acCurrentScaleFactor',
        'A',
      ],
      [
        'acVoltageAB',
        40077,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acVoltageBC',
        40078,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acVoltageCA',
        40079,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acVoltageAN',
        40080,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acVoltageBN',
        40081,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acVoltageCN',
        40082,
        RegisterDataType.Uint16,
        'acVoltageScaleFactor',
        'V',
      ],
      [
        'acPower',
        40084,
        RegisterDataType.Int16,
        'acPowerScaleFactor',
        'W',
      ],
      [
        'frequency',
        40086,
        RegisterDataType.Uint16,
        'frequencyScaleFactor',
        'Hz',
      ],
      [
        'apparentPower',
        40088,
        RegisterDataType.Int16,
        'apparentPowerScaleFactor',
        'VA',
      ],
      [
        'reactivePower',
        40090,
        RegisterDataType.Int16,
        'reactivePowerScaleFactor',
        'var',
      ],
      [
        'powerFactor',
        40092,
        RegisterDataType.Int16,
        'powerFactorScaleFactor',
        '%',
      ],
      [
        'dcCurrent',
        40097,
        RegisterDataType.Uint16,
        'dcCurrentScaleFactor',
        'A',
      ],
      [
        'dcVoltage',
        40099,
        RegisterDataType.Uint16,
        'dcVoltageScaleFactor',
        'V',
      ],
      [
        'dcPower',
        40101,
        RegisterDataType.Int16,
        'dcPowerScaleFactor',
        'W',
      ],
      [
        'temperature',
        40103,
        RegisterDataType.Int16,
        'temperatureScaleFactor',
        '°C',
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
        dataType,
        scaleProperty,
        unit,
      ) => {

        const definition =
          InverterModel103
            .create()
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
          dataType,
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

        if (property === 'temperature') {
          expect(
            definition.notImplementedValue,
          ).toBe(
            -32768,
          );
        }

      },
    );

    it.each([
      [
        'acCurrentScaleFactor',
        40076,
      ],
      [
        'acVoltageScaleFactor',
        40083,
      ],
      [
        'acPowerScaleFactor',
        40085,
      ],
      [
        'frequencyScaleFactor',
        40087,
      ],
      [
        'apparentPowerScaleFactor',
        40089,
      ],
      [
        'reactivePowerScaleFactor',
        40091,
      ],
      [
        'powerFactorScaleFactor',
        40093,
      ],
      [
        'dcCurrentScaleFactor',
        40098,
      ],
      [
        'dcVoltageScaleFactor',
        40100,
      ],
      [
        'dcPowerScaleFactor',
        40102,
      ],
      [
        'temperatureScaleFactor',
        40107,
      ],
    ])(
      'defines %s at address %s',
      (
        property,
        address,
      ) => {

        const definition =
          InverterModel103
            .create()
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
      'defines the operating status',
      () => {

        const definition =
          InverterModel103
            .create()
            .registerMap
            .get(
              'status',
            );

        expect(
          definition.address,
        ).toBe(
          40108,
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

    it(
      'uses a custom unit ID and model start address',
      () => {

        const model =
          InverterModel103.create(
            7,
            50000,
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
              'status',
            )
            .address,
        ).toBe(
          50038,
        );

      },
    );

    it.each([
      -1,
      1.5,
      65485,
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
