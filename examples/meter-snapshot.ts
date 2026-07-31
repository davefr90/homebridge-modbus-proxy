import {
  SunSpecClient,
} from '../src/sunspec/SunSpecClient.js';

import type {
  MeterSnapshot,
} from '../src/sunspec/models/snapshots/MeterSnapshot.js';

const numberFormatter =
  new Intl.NumberFormat(
    'en-US',
    {
      maximumFractionDigits: 3,
      useGrouping: false,
    },
  );

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

  if (
    !Number.isInteger(
      value,
    )
  ) {
    throw new Error(
      `Environment variable ${name} must be an integer.`,
    );
  }

  return value;

}

/**
 * Adds a timeout to an asynchronous operation.
 */
async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  description: string,
): Promise<T> {

  let timeoutHandle:
    ReturnType<typeof setTimeout>
    | undefined;

  const timeout =
    new Promise<never>(
      (
        _resolve,
        reject,
      ) => {

        timeoutHandle =
          setTimeout(
            () => {

              reject(
                new Error(
                  `${description} timed out after ${timeoutMs} ms.`,
                ),
              );

            },
            timeoutMs,
          );

      },
    );

  try {

    return await Promise.race([
      operation,
      timeout,
    ]);

  } finally {

    if (
      timeoutHandle !== undefined
    ) {
      clearTimeout(
        timeoutHandle,
      );
    }

  }

}

/**
 * Prints one meter measurement.
 */
function printMeasurement(
  label: string,
  value: number,
  unit: string,
): void {

  const formattedValue =
    numberFormatter.format(
      value,
    );

  console.log(
    `${label}: ${formattedValue} ${unit}`,
  );

}

/**
 * Prints a complete Model 203 meter snapshot.
 */
function printSnapshot(
  snapshot: MeterSnapshot,
): void {

  console.log(
    '\n=== SunSpec Meter Model 203 Snapshot ===',
  );

  console.log(
    '\nCurrent',
  );

  printMeasurement(
    'Total',
    snapshot.current,
    'A',
  );

  printMeasurement(
    'Phase A',
    snapshot.currentA,
    'A',
  );

  printMeasurement(
    'Phase B',
    snapshot.currentB,
    'A',
  );

  printMeasurement(
    'Phase C',
    snapshot.currentC,
    'A',
  );

  console.log(
    '\nLine-to-neutral voltage',
  );

  printMeasurement(
    'Average',
    snapshot.voltageLineNeutral,
    'V',
  );

  printMeasurement(
    'Phase AN',
    snapshot.voltageAN,
    'V',
  );

  printMeasurement(
    'Phase BN',
    snapshot.voltageBN,
    'V',
  );

  printMeasurement(
    'Phase CN',
    snapshot.voltageCN,
    'V',
  );

  console.log(
    '\nLine-to-line voltage',
  );

  printMeasurement(
    'Average',
    snapshot.voltageLineLine,
    'V',
  );

  printMeasurement(
    'Phase AB',
    snapshot.voltageAB,
    'V',
  );

  printMeasurement(
    'Phase BC',
    snapshot.voltageBC,
    'V',
  );

  printMeasurement(
    'Phase CA',
    snapshot.voltageCA,
    'V',
  );

  console.log(
    '\nFrequency',
  );

  printMeasurement(
    'Grid frequency',
    snapshot.frequency,
    'Hz',
  );

  console.log(
    '\nActive power',
  );

  printMeasurement(
    'Signed total',
    snapshot.activePower,
    'W',
  );

  printMeasurement(
    'Grid import',
    snapshot.importPower,
    'W',
  );

  printMeasurement(
    'Grid export',
    snapshot.exportPower,
    'W',
  );

  printMeasurement(
    'Phase A',
    snapshot.activePowerA,
    'W',
  );

  printMeasurement(
    'Phase B',
    snapshot.activePowerB,
    'W',
  );

  printMeasurement(
    'Phase C',
    snapshot.activePowerC,
    'W',
  );

  console.log(
    '\nApparent power',
  );

  printMeasurement(
    'Total',
    snapshot.apparentPower,
    'VA',
  );

  printMeasurement(
    'Phase A',
    snapshot.apparentPowerA,
    'VA',
  );

  printMeasurement(
    'Phase B',
    snapshot.apparentPowerB,
    'VA',
  );

  printMeasurement(
    'Phase C',
    snapshot.apparentPowerC,
    'VA',
  );

  console.log(
    '\nReactive power',
  );

  printMeasurement(
    'Total',
    snapshot.reactivePower,
    'var',
  );

  printMeasurement(
    'Phase A',
    snapshot.reactivePowerA,
    'var',
  );

  printMeasurement(
    'Phase B',
    snapshot.reactivePowerB,
    'var',
  );

  printMeasurement(
    'Phase C',
    snapshot.reactivePowerC,
    'var',
  );

  console.log(
    '\nPower factor',
  );

  printMeasurement(
    'Total',
    snapshot.powerFactor,
    '%',
  );

  printMeasurement(
    'Phase A',
    snapshot.powerFactorA,
    '%',
  );

  printMeasurement(
    'Phase B',
    snapshot.powerFactorB,
    '%',
  );

  printMeasurement(
    'Phase C',
    snapshot.powerFactorC,
    '%',
  );

  console.log(
    '\nEnergy counters',
  );

  printMeasurement(
    'Exported energy',
    snapshot.exportedEnergy,
    'Wh',
  );

  printMeasurement(
    'Imported energy',
    snapshot.importedEnergy,
    'Wh',
  );

  const unsignedEvents =
    snapshot.events >>> 0;

  const hexadecimalEvents =
    unsignedEvents
      .toString(
        16,
      )
      .toUpperCase()
      .padStart(
        8,
        '0',
      );

  console.log(
    '\nEvents',
  );

  console.log(
    `Decimal: ${unsignedEvents}`,
  );

  console.log(
    `Hexadecimal: 0x${hexadecimalEvents}`,
  );

  console.log(
    '\nRaw snapshot',
  );

  console.log(
    JSON.stringify(
      snapshot,
      null,
      2,
    ),
  );

}

/**
 * Reads a real SunSpec Model 203 meter snapshot.
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

  const unitId =
    readNumberEnvironmentVariable(
      'SUNSPEC_UNIT_ID',
      1,
    );

  console.log(
    `Target: ${host}:${port}, Modbus unit ${unitId}`,
  );

  console.log(
    'Connecting and performing SunSpec discovery...',
  );

  const client =
    await withTimeout(
      SunSpecClient.connect(
        {
          host,
          port,
          unitId,
          baseAddresses: [
            40000,
            0,
          ],
        },
      ),
      15000,
      'SunSpec client initialization',
    );

  console.log(
    'Connected.',
  );

  try {

    const meter =
      client.device().meter;

    if (
      meter === undefined
    ) {
      throw new Error(
        `SunSpec Model 203 was not discovered on Modbus unit ${unitId}.`,
      );
    }

    console.log(
      'SunSpec Model 203 discovered.',
    );

    console.log(
      'Reading meter snapshot...',
    );

    const snapshot =
      await withTimeout(
        meter.snapshot(),
        15000,
        'Meter snapshot',
      );

    console.log(
      'Meter snapshot read successfully.',
    );

    printSnapshot(
      snapshot,
    );

  } finally {

    console.log(
      '\nDisconnecting...',
    );

    await withTimeout(
      client.disconnect(),
      5000,
      'SunSpec client disconnection',
    );

    console.log(
      'Disconnected.',
    );

  }

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
        '\nMeter snapshot failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );