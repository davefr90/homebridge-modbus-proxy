import type {
  SolarEdgePlantSnapshot,
} from '../models/snapshots/SolarEdgePlantSnapshot.js';

import {
  SolarEdgePlantClient,
} from './SolarEdgePlantClient.js';

import type {
  SolarEdgePlantClientOptions,
} from './SolarEdgePlantClientOptions.js';

import type {
  SolarEdgePlantMonitorStatus,
} from './SolarEdgePlantMonitorStatus.js';

/**
 * Minimal connected plant-client surface used by the monitor.
 */
export interface SolarEdgePlantMonitorClient {

  readonly isConnected: boolean;

  snapshot(): Promise<SolarEdgePlantSnapshot>;

  disconnect(): Promise<void>;

}

export type SolarEdgePlantMonitorClientFactory =
  () => Promise<SolarEdgePlantMonitorClient>;

export type SolarEdgePlantSnapshotListener =
  (
    snapshot: SolarEdgePlantSnapshot,
    updatedAt: Date,
  ) => void;

export type SolarEdgePlantMonitorErrorListener =
  (
    error: Error,
    failedAt: Date,
  ) => void;

/**
 * Periodically reads, caches and publishes SolarEdge plant
 * snapshots. Failed clients are disconnected and recreated on
 * the next cycle.
 */
export class SolarEdgePlantMonitor {

  private timer:
    ReturnType<typeof setInterval>
    | undefined;

  private running =
    false;

  private client:
    SolarEdgePlantMonitorClient
    | undefined;

  private activeRefresh:
    Promise<SolarEdgePlantSnapshot>
    | undefined;

  private cachedSnapshot:
    SolarEdgePlantSnapshot
    | undefined;

  private lastAttemptAt:
    Date
    | undefined;

  private lastUpdatedAt:
    Date
    | undefined;

  private lastError:
    Error
    | undefined;

  private consecutiveFailures =
    0;

  private readonly snapshotListeners =
    new Set<SolarEdgePlantSnapshotListener>();

  private readonly errorListeners =
    new Set<SolarEdgePlantMonitorErrorListener>();

  public constructor(

    private readonly clientFactory:
      SolarEdgePlantMonitorClientFactory,

    private readonly intervalMs =
    5000,

  ) {

    if (
      !Number.isFinite(intervalMs)
      || intervalMs <= 0
    ) {
      throw new RangeError(
        'Plant polling interval must be greater than zero.',
      );
    }

  }

  /**
   * Creates a monitor backed by reconnectable plant clients.
   */
  public static create(
    options: SolarEdgePlantClientOptions,
    intervalMs = 5000,
  ): SolarEdgePlantMonitor {

    return new SolarEdgePlantMonitor(
      () =>
        SolarEdgePlantClient.connect(
          options,
        ),
      intervalMs,
    );

  }

  /**
   * Starts polling and immediately attempts the first refresh.
   * Initial failures are retained in the status while periodic
   * reconnect attempts continue.
   */
  public async start():
    Promise<void> {

    if (this.running) {
      return;
    }

    this.running =
      true;

    await this.runCycle();

    if (!this.running) {
      return;
    }

    this.timer =
      setInterval(
        () => {
          void this.runCycle();
        },
        this.intervalMs,
      );

  }

  /**
   * Stops polling, waits for an active refresh and disconnects
   * the current plant client.
   */
  public async stop():
    Promise<void> {

    this.running =
      false;

    if (this.timer !== undefined) {
      clearInterval(
        this.timer,
      );

      this.timer =
        undefined;
    }

    const activeRefresh =
      this.activeRefresh;

    if (activeRefresh !== undefined) {
      try {
        await activeRefresh;
      } catch {
        /* The refresh error is already stored and published. */
      }
    }

    await this.disconnectCurrentClient(
      false,
    );

  }

  /**
   * Performs an immediate refresh. Concurrent callers share
   * the same in-flight operation.
   */
  public refresh():
    Promise<SolarEdgePlantSnapshot> {

    if (this.activeRefresh !== undefined) {
      return this.activeRefresh;
    }

    const operation =
      this.performRefresh();

    this.activeRefresh =
      operation;

    operation.then(
      () => {
        this.clearActiveRefresh(
          operation,
        );
      },
      () => {
        this.clearActiveRefresh(
          operation,
        );
      },
    );

    return operation;

  }

  /**
   * Returns the last successful snapshot without triggering a
   * Modbus request.
   */
  public latest():
    SolarEdgePlantSnapshot | undefined {

    return this.cachedSnapshot;

  }

  /**
   * Returns a defensive copy of the current monitor state.
   */
  public status():
    SolarEdgePlantMonitorStatus {

    return {
      running:
        this.running,

      connected:
        this.client
          ?.isConnected
        ?? false,

      polling:
        this.activeRefresh !== undefined,

      lastAttemptAt:
        SolarEdgePlantMonitor.copyDate(
          this.lastAttemptAt,
        ),

      lastUpdatedAt:
        SolarEdgePlantMonitor.copyDate(
          this.lastUpdatedAt,
        ),

      lastError:
        this.lastError,

      consecutiveFailures:
        this.consecutiveFailures,
    };

  }

  public onSnapshot(
    listener: SolarEdgePlantSnapshotListener,
  ): void {

    this.snapshotListeners.add(
      listener,
    );

  }

  public offSnapshot(
    listener: SolarEdgePlantSnapshotListener,
  ): void {

    this.snapshotListeners.delete(
      listener,
    );

  }

  public onError(
    listener: SolarEdgePlantMonitorErrorListener,
  ): void {

    this.errorListeners.add(
      listener,
    );

  }

  public offError(
    listener: SolarEdgePlantMonitorErrorListener,
  ): void {

    this.errorListeners.delete(
      listener,
    );

  }

  private async runCycle():
    Promise<void> {

    if (!this.running) {
      return;
    }

    try {
      await this.refresh();
    } catch {
      /* Status and listeners already received the error. */
    }

  }

  private async performRefresh():
    Promise<SolarEdgePlantSnapshot> {

    const attemptedAt =
      new Date();

    this.lastAttemptAt =
      attemptedAt;

    try {

      const client =
        await this.connectedClient();

      const snapshot =
        await client.snapshot();

      const updatedAt =
        new Date();

      this.cachedSnapshot =
        snapshot;

      this.lastUpdatedAt =
        updatedAt;

      this.lastError =
        undefined;

      this.consecutiveFailures =
        0;

      this.notifySnapshot(
        snapshot,
        updatedAt,
      );

      return snapshot;

    } catch (error) {

      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
            String(error),
          );

      this.lastError =
        normalizedError;

      this.consecutiveFailures++;

      await this.disconnectCurrentClient(
        true,
      );

      this.notifyError(
        normalizedError,
        new Date(),
      );

      throw normalizedError;

    }

  }

  private async connectedClient():
    Promise<SolarEdgePlantMonitorClient> {

    if (
      this.client !== undefined
      && this.client.isConnected
    ) {
      return this.client;
    }

    await this.disconnectCurrentClient(
      true,
    );

    const client =
      await this.clientFactory();

    if (!client.isConnected) {
      try {
        await client.disconnect();
      } catch {
        /* Preserve the disconnected-client error below. */
      }

      throw new Error(
        'SolarEdge plant client is not connected.',
      );
    }

    this.client =
      client;

    return client;

  }

  private async disconnectCurrentClient(
    suppressError: boolean,
  ): Promise<void> {

    const client =
      this.client;

    this.client =
      undefined;

    if (client === undefined) {
      return;
    }

    try {
      await client.disconnect();
    } catch (error) {
      if (!suppressError) {
        throw error;
      }
    }

  }

  private clearActiveRefresh(
    operation: Promise<SolarEdgePlantSnapshot>,
  ): void {

    if (this.activeRefresh === operation) {
      this.activeRefresh =
        undefined;
    }

  }

  private notifySnapshot(
    snapshot: SolarEdgePlantSnapshot,
    updatedAt: Date,
  ): void {

    for (const listener of this.snapshotListeners) {
      try {
        listener(
          snapshot,
          new Date(
            updatedAt,
          ),
        );
      } catch {
        /* Listener errors must not interrupt polling. */
      }
    }

  }

  private notifyError(
    error: Error,
    failedAt: Date,
  ): void {

    for (const listener of this.errorListeners) {
      try {
        listener(
          error,
          new Date(
            failedAt,
          ),
        );
      } catch {
        /* Listener errors must not interrupt reconnects. */
      }
    }

  }

  private static copyDate(
    value: Date | undefined,
  ): Date | undefined {

    return value === undefined
      ? undefined
      : new Date(
        value,
      );

  }

}
