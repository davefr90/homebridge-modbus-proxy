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

}
