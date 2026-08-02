import {
  SunSpecClient,
} from '../src/sunspec/SunSpecClient.js';

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
 * Returns a human-readable Model 713 storage status.
 */
function formatStorageStatus(
  status: number | undefined,
): string {

  if (status === undefined) {
    return 'Not implemented';
  }

  switch (status) {

  case 0:
    return 'OK';

  case 1:
    return 'Warning';

  case 2:
    return 'Error';

  default:
    return `Unknown (${status})`;

  }

}

/**
 * Formats energy in watt-hours and kilowatt-hours.
 */
function formatEnergy(
  energyWh: number | undefined,
): string {

  if (energyWh === undefined) {
    return 'Not implemented';
  }

  return `${energyWh} Wh (${energyWh / 1000} kWh)`;

}

/**
 * Formats a percentage value.
 */
function formatPercentage(
  percentage: number | undefined,
): string {

  if (percentage === undefined) {
    return 'Not implemented';
  }

  return `${percentage} %`;

}

/**
 * Reads a real SunSpec Model 713 storage snapshot.
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
    await SunSpecClient.connect(
      {
        host,
        port,
        unitId,
        baseAddresses: [
          40000,
          0,
        ],
      },
    );

  console.log(
    'Connected.',
  );

  try {

    const storage =
      client.device().storage;

    if (storage === undefined) {
      throw new Error(
        'SunSpec Model 713 was not discovered.',
      );
    }

    console.log(
      'SunSpec Model 713 discovered.',
    );

    console.log(
      'Reading storage snapshot...',
    );

    const snapshot =
      await storage.snapshot();

    console.log(
      'Storage snapshot read successfully.',
    );

    console.log(
      '\n=== SunSpec DER Storage Capacity Model 713 Snapshot ===\n',
    );

    console.log(
      'Energy',
    );

    console.log(
      `Rated energy: ${formatEnergy(snapshot.energyRating)}`,
    );

    console.log(
      `Available energy: ${formatEnergy(snapshot.energyAvailable)}`,
    );

    console.log(
      '\nCondition',
    );

    console.log(
      `State of charge: ${formatPercentage(snapshot.stateOfCharge)}`,
    );

    console.log(
      `State of health: ${formatPercentage(snapshot.stateOfHealth)}`,
    );

    console.log(
      `Storage status: ${formatStorageStatus(snapshot.status)}`,
    );

    console.log(
      '\nRaw snapshot',
    );

    console.log(
      JSON.stringify(
        snapshot,
        undefined,
        2,
      ),
    );

  } finally {

    console.log(
      '\nDisconnecting...',
    );

    await client.disconnect();

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
        '\nStorage snapshot failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );
