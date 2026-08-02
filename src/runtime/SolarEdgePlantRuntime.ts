import type {
  NormalizedSolarEdgePlantPlatformConfiguration,
} from '../config/SolarEdgePlantPlatformConfiguration.js';

import type {
  Logger,
} from '../logging/Logger.js';

import type {
  SolarEdgePlantSnapshot,
} from '../sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import type {
  SolarEdgePlantClientOptions,
} from '../sunspec/solaredge/SolarEdgePlantClientOptions.js';

import {
  SolarEdgePlantMonitor,
} from '../sunspec/solaredge/SolarEdgePlantMonitor.js';

import type {
  SolarEdgePlantMonitorStatus,
} from '../sunspec/solaredge/SolarEdgePlantMonitorStatus.js';

/**
 * Monitor surface owned by the Homebridge plant runtime.
 */
export interface SolarEdgePlantRuntimeMonitor {

  start(): Promise<void>;

  stop(): Promise<void>;

  latest(): SolarEdgePlantSnapshot | undefined;

  status(): SolarEdgePlantMonitorStatus;

  onSnapshot(
    listener: (
      snapshot: SolarEdgePlantSnapshot,
      updatedAt: Date,
    ) => void,
  ): void;

  onError(
    listener: (
      error: Error,
      failedAt: Date,
    ) => void,
  ): void;

}

export type SolarEdgePlantRuntimeMonitorFactory =
  (
    options: SolarEdgePlantClientOptions,
    intervalMs: number,
  ) => SolarEdgePlantRuntimeMonitor;

/**
 * Owns the persistent SolarEdge plant monitor inside the
 * Homebridge process and exposes its cached state centrally.
 */
export class SolarEdgePlantRuntime {

  private readonly monitor:
    SolarEdgePlantRuntimeMonitor;

  private started =
    false;

  public constructor(

    private readonly configuration:
      NormalizedSolarEdgePlantPlatformConfiguration,

    private readonly logger:
      Logger,

    monitorFactory:
      SolarEdgePlantRuntimeMonitorFactory =
    (
      options,
      intervalMs,
    ) =>
      SolarEdgePlantMonitor.create(
        options,
        intervalMs,
      ),

  ) {

    this.monitor =
      monitorFactory(
        {
          host:
            configuration.host,

          port:
            configuration.port,

          unitIds:
            configuration.unitIds,

          meterUnitId:
            configuration.meterUnitId,

          baseAddresses: [
            40000,
            0,
          ],

          meterConsistencyThresholdWatts:
            configuration
              .meterConsistencyThresholdWatts,

          snapshotRetryCount:
            configuration
              .snapshotRetryCount,
        },
        configuration.pollIntervalMs,
      );

    this.monitor.onSnapshot(
      (
        snapshot,
        updatedAt,
      ) => {
        this.logSnapshot(
          snapshot,
          updatedAt,
        );
      },
    );

    this.monitor.onError(
      (
        error,
        failedAt,
      ) => {
        this.logger.warn(
          `SolarEdge plant refresh failed at ${failedAt.toISOString()}: ${error.message}`,
        );
      },
    );

  }

  /**
   * Starts the persistent monitor. Connection failures remain
   * inside the monitor and are retried periodically.
   */
  public async start():
    Promise<void> {

    if (this.started) {
      return;
    }

    this.started =
      true;

    this.logger.info(
      'Starting SolarEdge plant monitoring for '
      + `${this.configuration.host}:${this.configuration.port} `
      + `(units ${this.configuration.unitIds.join(', ')}).`,
    );

    try {

      await this.monitor.start();

      const status =
        this.monitor.status();

      if (status.connected) {
        this.logger.info(
          'SolarEdge plant monitor connected and running.',
        );
      } else {
        this.logger.warn(
          'SolarEdge plant monitor started without a connection; reconnect attempts will continue.',
        );
      }

    } catch (error) {

      this.started =
        false;

      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
            String(error),
          );

      this.logger.error(
        'Unable to start SolarEdge plant monitoring.',
        normalizedError,
      );

      throw normalizedError;

    }

  }

  /**
   * Stops polling and closes the shared Modbus connection.
   */
  public async stop():
    Promise<void> {

    if (!this.started) {
      return;
    }

    try {
      await this.monitor.stop();

      this.logger.info(
        'SolarEdge plant monitor stopped and disconnected.',
      );
    } finally {
      this.started =
        false;
    }

  }

  /**
   * Returns the most recent successful snapshot without any
   * Modbus communication.
   */
  public latest():
    SolarEdgePlantSnapshot | undefined {

    return this.monitor.latest();

  }

  public status():
    SolarEdgePlantMonitorStatus {

    return this.monitor.status();

  }

  private logSnapshot(
    snapshot: SolarEdgePlantSnapshot,
    updatedAt: Date,
  ): void {

    const batteryPower =
      snapshot.batteryPower === undefined
        ? 'n/a'
        : `${SolarEdgePlantRuntime.round(snapshot.batteryPower)} W`;

    this.logger.debug(
      `SolarEdge plant snapshot at ${updatedAt.toISOString()}: `
      + `load ${SolarEdgePlantRuntime.round(snapshot.consumptionPower)} W, `
      + `grid ${SolarEdgePlantRuntime.round(snapshot.gridPower)} W, `
      + `battery ${batteryPower}.`,
    );

  }

  private static round(
    value: number,
  ): number {

    return Number(
      value.toFixed(
        2,
      ),
    );

  }

}
