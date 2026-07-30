/**
 * Immutable snapshot of the SunSpec Nameplate Model.
 */
export interface NameplateSnapshot {

  /**
   * Maximum active power.
   */
  readonly maximumPower: number;

  /**
   * Maximum current.
   */
  readonly maximumCurrent: number;

  /**
   * Maximum voltage.
   */
  readonly maximumVoltage: number;

}