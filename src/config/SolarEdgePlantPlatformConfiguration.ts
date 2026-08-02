/**
 * User-facing SolarEdge plant configuration stored inside the
 * Homebridge platform configuration.
 */
export interface SolarEdgePlantPlatformConfiguration {

  readonly host: string;

  readonly port?: number;

  readonly unitIds?: readonly number[];

  readonly meterUnitId?: number;

  readonly pollIntervalMs?: number;

  readonly meterConsistencyThresholdWatts?: number;

  readonly snapshotRetryCount?: number;

}

/**
 * Fully validated SolarEdge configuration used by the runtime.
 */
export interface NormalizedSolarEdgePlantPlatformConfiguration {

  readonly host: string;

  readonly port: number;

  readonly unitIds: readonly number[];

  readonly meterUnitId: number;

  readonly pollIntervalMs: number;

  readonly meterConsistencyThresholdWatts: number;

  readonly snapshotRetryCount: number;

}
