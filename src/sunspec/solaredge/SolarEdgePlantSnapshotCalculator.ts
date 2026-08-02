import type {
  BatterySnapshot,
} from '../models/snapshots/BatterySnapshot.js';

import type {
  MeterSnapshot,
} from '../models/snapshots/MeterSnapshot.js';

import type {
  SolarEdgePlantSnapshot,
  SolarEdgePlantUnitSnapshot,
} from '../models/snapshots/SolarEdgePlantSnapshot.js';

/**
 * Calculates plant-wide values from individual inverter,
 * battery and meter snapshots.
 */
export class SolarEdgePlantSnapshotCalculator {

  public static calculate(
    units: readonly SolarEdgePlantUnitSnapshot[],
    meter: MeterSnapshot,
  ): SolarEdgePlantSnapshot {

    SolarEdgePlantSnapshotCalculator
      .validateUnits(
        units,
      );

    const immutableUnits =
      Object.freeze(
        [...units],
      );

    const inverterAcPower =
      units.reduce(
        (sum, unit) =>
          sum + unit.inverter.acPower,
        0,
      );

    const inverterDcPower =
      units.reduce(
        (sum, unit) =>
          sum + unit.inverter.dcPower,
        0,
      );

    const batteries =
      units.flatMap(
        (unit) =>
          unit.battery === undefined
            ? []
            : [
              unit.battery,
            ],
      );

    const batteryPower =
      SolarEdgePlantSnapshotCalculator
        .sumBatteryValues(
          batteries,
          (battery) =>
            battery.power,
        );

    const batteryChargePower =
      SolarEdgePlantSnapshotCalculator
        .sumBatteryValues(
          batteries,
          (battery) =>
            battery.chargePower,
        );

    const batteryDischargePower =
      SolarEdgePlantSnapshotCalculator
        .sumBatteryValues(
          batteries,
          (battery) =>
            battery.dischargePower,
        );

    const batteryRatedEnergy =
      SolarEdgePlantSnapshotCalculator
        .sumBatteryValues(
          batteries,
          (battery) =>
            battery.ratedEnergy,
        );

    const batteryStoredEnergy =
      SolarEdgePlantSnapshotCalculator
        .calculateStoredEnergy(
          batteries,
        );

    const batteryStateOfEnergy =
      batteryRatedEnergy === undefined
      || batteryRatedEnergy <= 0
      || batteryStoredEnergy === undefined
        ? undefined
        : batteryStoredEnergy
          / batteryRatedEnergy
          * 100;

    return {
      units:
        immutableUnits,

      meter,
      inverterAcPower,
      inverterDcPower,

      gridPower:
        meter.activePower,

      gridImportPower:
        meter.importPower,

      gridExportPower:
        meter.exportPower,

      consumptionPower:
        Math.max(
          0,
          inverterAcPower
          - meter.activePower,
        ),

      batteryPower,
      batteryChargePower,
      batteryDischargePower,

      solarPowerEstimate:
        batteryPower === undefined
          ? undefined
          : Math.max(
            0,
            inverterAcPower
            + batteryPower,
          ),

      batteryRatedEnergy,
      batteryStoredEnergy,
      batteryStateOfEnergy,
    };

  }

  /**
   * Sums one optional value from every detected battery.
   * A missing battery point makes the aggregate unavailable.
   */
  private static sumBatteryValues(
    batteries: readonly BatterySnapshot[],
    selector: (
      battery: BatterySnapshot,
    ) => number | undefined,
  ): number | undefined {

    if (batteries.length === 0) {
      return undefined;
    }

    let sum = 0;

    for (const battery of batteries) {
      const value =
        selector(
          battery,
        );

      if (value === undefined) {
        return undefined;
      }

      sum += value;
    }

    return sum;

  }

  /**
   * Calculates stored energy from each battery's rated energy
   * and state of energy.
   */
  private static calculateStoredEnergy(
    batteries: readonly BatterySnapshot[],
  ): number | undefined {

    if (batteries.length === 0) {
      return undefined;
    }

    let storedEnergy = 0;

    for (const battery of batteries) {
      if (
        battery.ratedEnergy === undefined
        || battery.stateOfEnergy === undefined
      ) {
        return undefined;
      }

      storedEnergy +=
        battery.ratedEnergy
        * battery.stateOfEnergy
        / 100;
    }

    return storedEnergy;

  }

  /**
   * Ensures that at least one unique inverter unit exists.
   */
  private static validateUnits(
    units: readonly SolarEdgePlantUnitSnapshot[],
  ): void {

    if (units.length === 0) {
      throw new Error(
        'At least one SolarEdge plant unit is required.',
      );
    }

    const unitIds =
      new Set<number>();

    for (const unit of units) {
      if (unitIds.has(unit.unitId)) {
        throw new Error(
          `Duplicate SolarEdge plant unit ID: ${unit.unitId}`,
        );
      }

      unitIds.add(
        unit.unitId,
      );
    }

  }

}
