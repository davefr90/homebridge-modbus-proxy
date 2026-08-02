/**
 * Connection and topology options for a SolarEdge plant.
 */
export interface SolarEdgePlantClientOptions {

  readonly host: string;

  readonly port?: number;

  /**
   * Inverter Modbus unit identifiers.
   *
   * @default [2, 3]
   */
  readonly unitIds?: readonly number[];

  /**
   * Unit containing SunSpec Meter Model 203.
   *
   * @default First configured unit
   */
  readonly meterUnitId?: number;

  /**
   * Candidate SunSpec base addresses.
   *
   * @default [40000, 0]
   */
  readonly baseAddresses?: readonly number[];

  /**
   * Maximum permitted change in signed meter power between
   * the readings taken before and after all inverter units.
   *
   * A larger change indicates that the plant changed while
   * the sequential Modbus snapshot was being assembled.
   *
   * @default 500
   */
  readonly meterConsistencyThresholdWatts?: number;

  /**
   * Number of immediate retries after an inconsistent meter
   * frame was detected.
   *
   * @default 1
   */
  readonly snapshotRetryCount?: number;

}
