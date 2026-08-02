import type {
  SolarEdgePlantSnapshot,
} from '../src/sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import {
  SolarEdgePlantMonitor,
} from '../src/sunspec/solaredge/SolarEdgePlantMonitor.js';

/**
 * Reads an integer environment variable.
 */
function readNumberEnvironmentVariable(
  name: string,
  defaultValue: number,
): number {

  const rawValue =
    process.env[name];

  if (
    rawValue === undefined
    || rawValue.trim() === ''
  ) {
    return defaultValue;
  }

  const value =
    Number(
      rawValue,
    );

  if (!Number.isInteger(value)) {
    throw new Error(
      `Environment variable ${name} must be an integer.`,
    );
  }

  return value;

}

/**
 * Reads a comma-separated Modbus unit list.
 */
function readUnitIds():
  readonly number[] {

  const rawValue =
    process.env.SUNSPEC_UNIT_IDS
      ?.trim()
    ?? '2,3';

  const unitIds =
    rawValue
      .split(',')
      .map(
        (value) =>
          Number(
            value.trim(),
          ),
      );

  if (
    unitIds.length === 0
    || unitIds.some(
      (unitId) =>
        !Number.isInteger(unitId),
    )
  ) {
    throw new Error(
      'SUNSPEC_UNIT_IDS must be a comma-separated integer list.',
    );
  }

  return unitIds;

}

/**
 * Formats power without floating-point tails.
 */
function formatPower(
  value: number | undefined,
): string {

  if (value === undefined) {
    return 'n/a';
  }

  return `${
    Math.round(
      value * 100,
    ) / 100
  } W`;

}

/**
 * Prints one compact live-monitor line.
 */
function printSnapshot(
  snapshot: SolarEdgePlantSnapshot,
  updatedAt: Date,
): void {

  const stateOfEnergy =
    snapshot.batteryStateOfEnergy === undefined
      ? 'n/a'
      : `${
        Math.round(
          snapshot.batteryStateOfEnergy
          * 100,
        ) / 100
      } %`;

  console.log(
    [
      `[${updatedAt.toLocaleTimeString()}]`,
      `PV ${formatPower(snapshot.solarPowerEstimate)}`,
      `Load ${formatPower(snapshot.consumptionPower)}`,
      `Grid import ${formatPower(snapshot.gridImportPower)}`,
      `Grid export ${formatPower(snapshot.gridExportPower)}`,
      `Battery ${formatPower(snapshot.batteryPower)}`,
      `SoE ${stateOfEnergy}`,
    ].join(
      ' | ',
    ),
  );

}

/**
 * Waits until the process receives a shutdown signal.
 */
function waitForShutdownSignal():
  Promise<NodeJS.Signals> {

  return new Promise(
    (resolve) => {

      const handleSignal =
        (signal: NodeJS.Signals) => {

          process.off(
            'SIGINT',
            handleSignal,
          );

          process.off(
            'SIGTERM',
            handleSignal,
          );

          resolve(
            signal,
          );

        };

      process.on(
        'SIGINT',
        handleSignal,
      );

      process.on(
        'SIGTERM',
        handleSignal,
      );

    },
  );

}

/**
 * Runs a reconnecting SolarEdge plant monitor until Ctrl+C.
 */
async function main():
  Promise<void> {

  const host =
    process.env.SUNSPEC_HOST
      ?.trim();

  if (
    host === undefined
    || host === ''
  ) {
    throw new Error(
      'SUNSPEC_HOST is required.',
    );
  }

  const port =
    readNumberEnvironmentVariable(
      'SUNSPEC_PORT',
      502,
    );

  const unitIds =
    readUnitIds();

  const firstUnitId =
    unitIds[0];

  if (firstUnitId === undefined) {
    throw new Error(
      'At least one inverter unit is required.',
    );
  }

  const meterUnitId =
    readNumberEnvironmentVariable(
      'SUNSPEC_METER_UNIT_ID',
      firstUnitId,
    );

  const intervalMs =
    readNumberEnvironmentVariable(
      'SUNSPEC_POLL_INTERVAL_MS',
      5000,
    );

  const meterConsistencyThresholdWatts =
    readNumberEnvironmentVariable(
      'SUNSPEC_METER_CONSISTENCY_THRESHOLD_WATTS',
      500,
    );

  const snapshotRetryCount =
    readNumberEnvironmentVariable(
      'SUNSPEC_SNAPSHOT_RETRY_COUNT',
      1,
    );

  const monitor =
    SolarEdgePlantMonitor.create(
      {
        host,
        port,
        unitIds,
        meterUnitId,
        baseAddresses: [
          40000,
          0,
        ],
        meterConsistencyThresholdWatts,
        snapshotRetryCount,
      },
      intervalMs,
    );

  monitor.onSnapshot(
    printSnapshot,
  );

  monitor.onError(
    (
      error,
      failedAt,
    ) => {
      console.error(
        `[${failedAt.toLocaleTimeString()}] ${error.message}`,
      );
    },
  );

  console.log(
    `Monitoring ${host}:${port}, units ${unitIds.join(', ')}, every ${intervalMs} ms.`,
  );

  console.log(
    'Snapshot consistency: maximum meter change '
    + `${meterConsistencyThresholdWatts} W, `
    + `${snapshotRetryCount} immediate retries.`,
  );

  console.log(
    'Press Ctrl+C to stop.\n',
  );

  await monitor.start();

  const signal =
    await waitForShutdownSignal();

  console.log(
    `\nReceived ${signal}. Stopping monitor...`,
  );

  await monitor.stop();

  console.log(
    'Monitor stopped and disconnected.',
  );

}

main()
  .catch(
    (error: unknown) => {

      const message =
        error instanceof Error
          ? error.stack
            ?? error.message
          : String(
            error,
          );

      console.error(
        '\nPlant monitor failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );
