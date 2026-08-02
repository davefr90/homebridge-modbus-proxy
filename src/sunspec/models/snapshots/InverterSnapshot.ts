/**
 * Immutable snapshot of the SunSpec Inverter Model.
 */
export interface InverterSnapshot {

  readonly acCurrent: number;

  readonly acCurrentA: number;

  readonly acCurrentB: number;

  readonly acCurrentC: number;

  readonly acVoltageAB: number;

  readonly acVoltageBC: number;

  readonly acVoltageCA: number;

  readonly acVoltageAN: number;

  readonly acVoltageBN: number;

  readonly acVoltageCN: number;

  readonly acPower: number;

  readonly frequency: number;

  readonly apparentPower: number;

  readonly reactivePower: number;

  readonly powerFactor: number;

  readonly dcCurrent: number;

  readonly dcVoltage: number;

  readonly dcPower: number;

  readonly temperature: number | undefined;

  /**
   * Raw SunSpec inverter status.
   *
   * This will later become SunSpecInverterStatus.
   */
  readonly status: number;

}
