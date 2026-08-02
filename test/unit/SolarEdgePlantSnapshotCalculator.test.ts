import {
  describe,
  expect,
  it,
} from 'vitest';

import type {
  BatterySnapshot,
} from '../../src/sunspec/models/snapshots/BatterySnapshot.js';

import type {
  InverterSnapshot,
} from '../../src/sunspec/models/snapshots/InverterSnapshot.js';

import type {
  MeterSnapshot,
} from '../../src/sunspec/models/snapshots/MeterSnapshot.js';

import {
  SolarEdgePlantSnapshotCalculator,
} from '../../src/sunspec/solaredge/SolarEdgePlantSnapshotCalculator.js';

/**
 * Creates a complete inverter snapshot for aggregation tests.
 */
function createInverter(
  acPower: number,
  dcPower: number,
): InverterSnapshot {

  return {
    acCurrent: 0,
    acCurrentA: 0,
    acCurrentB: 0,
    acCurrentC: 0,
    acVoltageAB: 400,
    acVoltageBC: 400,
    acVoltageCA: 400,
    acVoltageAN: 230,
    acVoltageBN: 230,
    acVoltageCN: 230,
    acPower,
    frequency: 50,
    apparentPower: 0,
    reactivePower: 0,
    powerFactor: 100,
    dcCurrent: 0,
    dcVoltage: 0,
    dcPower,
    temperature: 25,
    status: 4,
  };

}

/**
 * Creates a complete battery snapshot for aggregation tests.
 */
function createBattery(
  power: number | undefined,
  stateOfEnergy: number | undefined,
): BatterySnapshot {

  return {
    manufacturer: '48V_BYD',
    model: 'BYD Premium LVS 16.0',
    firmwareVersion: '1.0',
    serialNumber: 'BATTERY',
    deviceId: 112,
    ratedEnergy: 16000,
    maximumChargeContinuousPower: 5000,
    maximumDischargeContinuousPower: 5000,
    maximumChargePeakPower: 50,
    maximumDischargePeakPower: 10400,
    averageTemperature: 25,
    maximumTemperature: 0,
    voltage: 820,
    current: 0.5,
    power,

    chargePower:
      power === undefined
        ? undefined
        : Math.max(
          power,
          0,
        ),

    dischargePower:
      power === undefined
        ? undefined
        : Math.max(
          -power,
          0,
        ),

    maximumEnergy: 16000,
    availableEnergy: 16000,
    stateOfHealth: 100,
    stateOfEnergy,
    status: 4,
    statusInternal: 3,
  };

}

/**
 * Creates a complete meter snapshot with signed active power.
 */
function createMeter(
  activePower: number,
): MeterSnapshot {

  return {
    current: 0,
    currentA: 0,
    currentB: 0,
    currentC: 0,
    voltageLineNeutral: 230,
    voltageAN: 230,
    voltageBN: 230,
    voltageCN: 230,
    voltageLineLine: 400,
    voltageAB: 400,
    voltageBC: 400,
    voltageCA: 400,
    frequency: 50,
    activePower,
    importPower:
      Math.max(
        0,
        -activePower,
      ),
    exportPower:
      Math.max(
        0,
        activePower,
      ),
    activePowerA: 0,
    activePowerB: 0,
    activePowerC: 0,
    apparentPower: 0,
    apparentPowerA: 0,
    apparentPowerB: 0,
    apparentPowerC: 0,
    reactivePower: 0,
    reactivePowerA: 0,
    reactivePowerB: 0,
    reactivePowerC: 0,
    powerFactor: 100,
    powerFactorA: 100,
    powerFactorB: 100,
    powerFactorC: 100,
    exportedEnergy: 0,
    importedEnergy: 0,
    events: 0,
  };

}

describe(
  'SolarEdgePlantSnapshotCalculator',
  () => {

    it(
      'aggregates two inverters and capacity-weights two batteries',
      () => {

        const result =
          SolarEdgePlantSnapshotCalculator
            .calculate(
              [
                {
                  unitId: 2,
                  inverter:
                    createInverter(
                      1500,
                      1700,
                    ),
                  battery:
                    createBattery(
                      -486,
                      97,
                    ),
                },
                {
                  unitId: 3,
                  inverter:
                    createInverter(
                      1300,
                      1500,
                    ),
                  battery:
                    createBattery(
                      -382,
                      96,
                    ),
                },
              ],
              createMeter(
                -200,
              ),
            );

        expect(
          result,
        ).toMatchObject({
          inverterAcPower: 2800,
          inverterDcPower: 3200,
          gridPower: -200,
          gridImportPower: 200,
          gridExportPower: 0,
          consumptionPower: 3000,
          batteryPower: -868,
          batteryChargePower: 0,
          batteryDischargePower: 868,
          solarPowerEstimate: 1932,
          batteryRatedEnergy: 32000,
          batteryStoredEnergy: 30880,
          batteryStateOfEnergy: 96.5,
        });

        expect(
          result.units,
        ).toHaveLength(
          2,
        );

        expect(
          Object.isFrozen(
            result.units,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'calculates export and battery charging',
      () => {

        const result =
          SolarEdgePlantSnapshotCalculator
            .calculate(
              [
                {
                  unitId: 2,
                  inverter:
                    createInverter(
                      5000,
                      5500,
                    ),
                  battery:
                    createBattery(
                      600,
                      80,
                    ),
                },
              ],
              createMeter(
                1500,
              ),
            );

        expect(
          result,
        ).toMatchObject({
          consumptionPower: 3500,
          gridImportPower: 0,
          gridExportPower: 1500,
          batteryPower: 600,
          batteryChargePower: 600,
          batteryDischargePower: 0,
          solarPowerEstimate: 5600,
          batteryStoredEnergy: 12800,
          batteryStateOfEnergy: 80,
        });

      },
    );

    it(
      'keeps incomplete battery aggregates unavailable',
      () => {

        const result =
          SolarEdgePlantSnapshotCalculator
            .calculate(
              [
                {
                  unitId: 2,
                  inverter:
                    createInverter(
                      1000,
                      1100,
                    ),
                  battery:
                    createBattery(
                      undefined,
                      undefined,
                    ),
                },
              ],
              createMeter(
                0,
              ),
            );

        expect(
          result.batteryPower,
        ).toBeUndefined();

        expect(
          result.solarPowerEstimate,
        ).toBeUndefined();

        expect(
          result.batteryStoredEnergy,
        ).toBeUndefined();

        expect(
          result.batteryStateOfEnergy,
        ).toBeUndefined();

      },
    );

    it(
      'rejects empty and duplicate inverter unit collections',
      () => {

        expect(
          () =>
            SolarEdgePlantSnapshotCalculator
              .calculate(
                [],
                createMeter(
                  0,
                ),
              ),
        ).toThrow(
          'At least one SolarEdge plant unit is required.',
        );

        const unit = {
          unitId: 2,
          inverter:
            createInverter(
              0,
              0,
            ),
        };

        expect(
          () =>
            SolarEdgePlantSnapshotCalculator
              .calculate(
                [
                  unit,
                  unit,
                ],
                createMeter(
                  0,
                ),
              ),
        ).toThrow(
          'Duplicate SolarEdge plant unit ID: 2',
        );

      },
    );

  },
);
