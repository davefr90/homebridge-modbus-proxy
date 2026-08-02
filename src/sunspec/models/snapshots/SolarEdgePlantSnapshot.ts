import type {
  InverterSnapshot,
} from './InverterSnapshot.js';

import type {
  BatterySnapshot,
} from './BatterySnapshot.js';

import type {
  MeterSnapshot,
} from './MeterSnapshot.js';

/**
 * Snapshot of one inverter unit included in a SolarEdge plant.
 */
export interface SolarEdgePlantUnitSnapshot {

  readonly unitId: number;

  readonly inverter: InverterSnapshot;

  readonly battery?: BatterySnapshot;

}

/**
 * Aggregated snapshot of a multi-inverter SolarEdge plant.
 */
export interface SolarEdgePlantSnapshot {

  readonly units:
    readonly SolarEdgePlantUnitSnapshot[];

  readonly meter: MeterSnapshot;

  /**
   * Sum of all inverter AC power values.
   */
  readonly inverterAcPower: number;

  /**
   * Sum of all inverter DC power values.
   */
  readonly inverterDcPower: number;

  /**
   * Signed grid power using the meter convention.
   *
   * Positive = export
   * Negative = import
   */
  readonly gridPower: number;

  readonly gridImportPower: number;

  readonly gridExportPower: number;

  /**
   * Calculated site consumption:
   * inverter AC power - signed grid power.
   */
  readonly consumptionPower: number;

  /**
   * Sum of all signed battery power values.
   *
   * Positive = charging
   * Negative = discharging
   */
  readonly batteryPower: number | undefined;

  readonly batteryChargePower:
    number | undefined;

  readonly batteryDischargePower:
    number | undefined;

  /**
   * Estimated PV power before conversion losses:
   * inverter AC power + signed battery power.
   */
  readonly solarPowerEstimate:
    number | undefined;

  readonly batteryRatedEnergy:
    number | undefined;

  readonly batteryStoredEnergy:
    number | undefined;

  /**
   * Capacity-weighted state of energy.
   */
  readonly batteryStateOfEnergy:
    number | undefined;

}
