/**
 * Immutable snapshot of SunSpec Model 713:
 * DER Storage Capacity.
 */
export interface StorageSnapshot {

  /**
   * Rated storage energy in watt-hours.
   */
  readonly energyRating: number | undefined;

  /**
   * Currently available storage energy in watt-hours.
   */
  readonly energyAvailable: number | undefined;

  /**
   * Current state of charge in percent.
   */
  readonly stateOfCharge: number | undefined;

  /**
   * Current state of health in percent.
   */
  readonly stateOfHealth: number | undefined;

  /**
   * Storage status enumeration.
   *
   * 0 = OK
   * 1 = Warning
   * 2 = Error
   */
  readonly status: number | undefined;

}
