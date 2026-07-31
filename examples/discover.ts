import {
  ModbusClient,
} from '../src/client/ModbusClient.js';

import {
  SunSpecDiscovery,
} from '../src/sunspec/discovery/SunSpecDiscovery.js';

import {
  DiscoveryFormatter,
} from '../src/sunspec/formatting/DiscoveryFormatter.js';

import {
  SunSpecDeviceInformation,
} from '../src/sunspec/devices/SunSpecDeviceInformation.js';

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
 * Runs SunSpec discovery against a real Modbus TCP device.
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

  const client =
    new ModbusClient(
      host,
      port,
    );

  console.log(
    `Target: ${host}:${port}, Modbus unit ${unitId}`,
  );

  console.log(
    'Step 1/3: Opening TCP connection...',
  );

  await withTimeout(
    client.connect(),
    5000,
    'TCP connection',
  );

  console.log(
    'Step 1/3: TCP connection established.',
  );

  try {

    console.log(
      'Step 2/3: Reading SunSpec identifier and model chain...',
    );

    const discovery =
      new SunSpecDiscovery(
        client,
        {
          baseAddresses: [
            40000,
            0,
          ],
        },
      );

    const result =
      await withTimeout(
        discovery.discover(
          unitId,
        ),
        10000,
        'SunSpec discovery',
      );

    console.log(
      'Step 2/3: SunSpec discovery successful.',
    );

    console.log(
      'Step 3/3: Formatting result...\n',
    );

    const information =
      new SunSpecDeviceInformation(
        result,
      );

    console.log(
      DiscoveryFormatter.format(
        information,
      ),
    );

  } finally {

    console.log(
      '\nClosing connection...',
    );

    await withTimeout(
      client.disconnect(),
      5000,
      'TCP disconnection',
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
        '\nDiscovery failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );