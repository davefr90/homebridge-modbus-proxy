import {
  SunSpecClient,
} from '../src/sunspec/SunSpecClient.js';

import {
  SolarEdgeBatteryStatus,
} from '../src/sunspec/solaredge/SolarEdgeBatteryStatus.js';

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
 * Formats an optional numeric value and its engineering unit.
 */
function formatValue(
  value: number | undefined,
  unit: string,
): string {

  if (value === undefined) {
    return 'Not implemented';
  }

  return unit === ''
    ? String(
      value,
    )
    : `${value} ${unit}`;

}

/**
 * Formats optional energy in watt-hours and kilowatt-hours.
 */
function formatEnergy(
  value: number | undefined,
): string {

  if (value === undefined) {
    return 'Not implemented';
  }

  return `${value} Wh (${value / 1000} kWh)`;

}

/**
 * Returns a human-readable SolarEdge battery status.
 */
function formatStatus(
  status: number | undefined,
): string {

  if (status === undefined) {
    return 'Not implemented';
  }

  switch (status) {

  case SolarEdgeBatteryStatus.Off:
    return 'Off';

  case SolarEdgeBatteryStatus.Standby:
    return 'Standby';

  case SolarEdgeBatteryStatus.Initializing:
    return 'Initializing';

  case SolarEdgeBatteryStatus.Charging:
    return 'Charging';

  case SolarEdgeBatteryStatus.Discharging:
    return 'Discharging';

  case SolarEdgeBatteryStatus.Fault:
    return 'Fault';

  case SolarEdgeBatteryStatus.Idle:
    return 'Idle';

  default:
    return `Unknown (${status})`;

  }

}

/**
 * Reads one inverter's proprietary SolarEdge Battery 1
 * snapshot.
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
    'Connecting and performing device discovery...',
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

    const battery =
      client.device().battery;

    if (battery === undefined) {
      throw new Error(
        'No SolarEdge Battery 1 register block was detected.',
      );
    }

    console.log(
      'SolarEdge Battery 1 register block detected.',
    );

    console.log(
      'Reading battery snapshot...',
    );

    const snapshot =
      await battery.snapshot();

    console.log(
      'Battery snapshot read successfully.',
    );

    console.log(
      '\n=== SolarEdge Battery Snapshot ===\n',
    );

    console.log(
      'Identification',
    );

    console.log(
      `Manufacturer: ${snapshot.manufacturer}`,
    );

    console.log(
      `Model: ${snapshot.model}`,
    );

    console.log(
      `Firmware version: ${snapshot.firmwareVersion}`,
    );

    console.log(
      `Serial number: ${snapshot.serialNumber}`,
    );

    console.log(
      `Device ID: ${formatValue(snapshot.deviceId, '')}`,
    );

    console.log(
      '\nPower',
    );

    console.log(
      `Signed power: ${formatValue(snapshot.power, 'W')}`,
    );

    console.log(
      `Charging power: ${formatValue(snapshot.chargePower, 'W')}`,
    );

    console.log(
      `Discharging power: ${formatValue(snapshot.dischargePower, 'W')}`,
    );

    console.log(
      `Voltage: ${formatValue(snapshot.voltage, 'V')}`,
    );

    console.log(
      `Current: ${formatValue(snapshot.current, 'A')}`,
    );

    console.log(
      '\nEnergy and condition',
    );

    console.log(
      `Rated energy: ${formatEnergy(snapshot.ratedEnergy)}`,
    );

    console.log(
      `Maximum energy: ${formatEnergy(snapshot.maximumEnergy)}`,
    );

    console.log(
      `Available energy: ${formatEnergy(snapshot.availableEnergy)}`,
    );

    console.log(
      `State of energy: ${formatValue(snapshot.stateOfEnergy, '%')}`,
    );

    console.log(
      `State of health: ${formatValue(snapshot.stateOfHealth, '%')}`,
    );

    console.log(
      `Average temperature: ${formatValue(snapshot.averageTemperature, '°C')}`,
    );

    console.log(
      `Maximum temperature: ${formatValue(snapshot.maximumTemperature, '°C')}`,
    );

    console.log(
      `Status: ${formatStatus(snapshot.status)}`,
    );

    console.log(
      `Internal status: ${formatValue(snapshot.statusInternal, '')}`,
    );

    console.log(
      '\nLimits',
    );

    console.log(
      `Maximum continuous charge power: ${formatValue(snapshot.maximumChargeContinuousPower, 'W')}`,
    );

    console.log(
      `Maximum continuous discharge power: ${formatValue(snapshot.maximumDischargeContinuousPower, 'W')}`,
    );

    console.log(
      `Maximum peak charge power: ${formatValue(snapshot.maximumChargePeakPower, 'W')}`,
    );

    console.log(
      `Maximum peak discharge power: ${formatValue(snapshot.maximumDischargePeakPower, 'W')}`,
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
        '\nBattery snapshot failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );
