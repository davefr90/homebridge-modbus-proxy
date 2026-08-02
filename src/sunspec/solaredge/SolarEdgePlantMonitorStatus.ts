/**
 * Current operational state of a SolarEdge plant monitor.
 */
export interface SolarEdgePlantMonitorStatus {

  readonly running: boolean;

  readonly connected: boolean;

  readonly polling: boolean;

  readonly lastAttemptAt: Date | undefined;

  readonly lastUpdatedAt: Date | undefined;

  readonly lastError: Error | undefined;

  readonly consecutiveFailures: number;

}
