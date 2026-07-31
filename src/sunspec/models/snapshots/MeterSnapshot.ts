/**
 * Immutable snapshot of SunSpec three-phase meter model 203.
 */
export interface MeterSnapshot {

  readonly current:
    number;

  readonly currentA:
    number;

  readonly currentB:
    number;

  readonly currentC:
    number;

  readonly voltageLineNeutral:
    number;

  readonly voltageAN:
    number;

  readonly voltageBN:
    number;

  readonly voltageCN:
    number;

  readonly voltageLineLine:
    number;

  readonly voltageAB:
    number;

  readonly voltageBC:
    number;

  readonly voltageCA:
    number;

  readonly frequency:
    number;

  /**
   * Signed total meter active power.
   *
   * Positive values represent grid export.
   * Negative values represent grid import.
   */
  readonly activePower:
    number;

  /**
   * Current grid import power.
   *
   * The value is always greater than or equal to zero.
   */
  readonly importPower:
    number;

  /**
   * Current grid export power.
   *
   * The value is always greater than or equal to zero.
   */
  readonly exportPower:
    number;

  readonly activePowerA:
    number;

  readonly activePowerB:
    number;

  readonly activePowerC:
    number;

  readonly apparentPower:
    number;

  readonly apparentPowerA:
    number;

  readonly apparentPowerB:
    number;

  readonly apparentPowerC:
    number;

  readonly reactivePower:
    number;

  readonly reactivePowerA:
    number;

  readonly reactivePowerB:
    number;

  readonly reactivePowerC:
    number;

  readonly powerFactor:
    number;

  readonly powerFactorA:
    number;

  readonly powerFactorB:
    number;

  readonly powerFactorC:
    number;

  readonly exportedEnergy:
    number;

  readonly importedEnergy:
    number;

  readonly events:
    number;

}