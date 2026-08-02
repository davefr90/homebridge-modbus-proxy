/**
 * Immutable snapshot of one inverter's proprietary
 * SolarEdge Battery 1 block.
 */
export interface BatterySnapshot {

  readonly manufacturer: string;

  readonly model: string;

  readonly firmwareVersion: string;

  readonly serialNumber: string;

  readonly deviceId: number | undefined;

  readonly ratedEnergy: number | undefined;

  readonly maximumChargeContinuousPower:
    number | undefined;

  readonly maximumDischargeContinuousPower:
    number | undefined;

  readonly maximumChargePeakPower:
    number | undefined;

  readonly maximumDischargePeakPower:
    number | undefined;

  readonly averageTemperature: number | undefined;

  readonly maximumTemperature: number | undefined;

  readonly voltage: number | undefined;

  readonly current: number | undefined;

  /**
   * Signed instantaneous power in watts.
   *
   * Positive = charging
   * Negative = discharging
   */
  readonly power: number | undefined;

  /**
   * Charging power as a positive value in watts.
   */
  readonly chargePower: number | undefined;

  /**
   * Discharging power as a positive value in watts.
   */
  readonly dischargePower: number | undefined;

  readonly maximumEnergy: number | undefined;

  readonly availableEnergy: number | undefined;

  readonly stateOfHealth: number | undefined;

  readonly stateOfEnergy: number | undefined;

  readonly status: number | undefined;

  readonly statusInternal: number | undefined;

}
