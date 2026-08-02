import type {
  SolarEdgePlantSnapshot,
} from '../src/sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import {
  SolarEdgePlantClient,
} from '../src/sunspec/solaredge/SolarEdgePlantClient.js';

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
 * Reads a comma-separated list of Modbus unit identifiers.
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
 * Formats a number without long floating-point tails.
 */
function formatNumber(
  value: number,
): string {

  return String(
    Math.round(
      value * 100,
    ) / 100,
  );

}

/**
 * Formats an optional power value.
 */
function formatPower(
  value: number | undefined,
): string {

  return value === undefined
    ? 'Not available'
    : `${formatNumber(value)} W`;

}

/**
 * Formats optional energy in watt-hours and kilowatt-hours.
 */
function formatEnergy(
  value: number | undefined,
): string {

  if (value === undefined) {
    return 'Not available';
  }

  return `${formatNumber(value)} Wh (${formatNumber(value / 1000)} kWh)`;

}

/**
 * Prints individual inverter and battery values.
 */
function printUnits(
  snapshot: SolarEdgePlantSnapshot,
): void {

  console.log(
    'Inverter units',
  );

  for (const unit of snapshot.units) {
    console.log(
      `
Unit ${unit.unitId}`,
    );

    console.log(
      `Inverter AC power: ${formatPower(unit.inverter.acPower)}`,
    );

    console.log(
      `Inverter DC power: ${formatPower(unit.inverter.dcPower)}`,
    );

    if (unit.battery === undefined) {
      console.log(
        'Battery: Not detected',
      );

      continue;
    }

    console.log(
      `Battery: ${unit.battery.manufacturer} ${unit.battery.model}`,
    );

    console.log(
      `Battery signed power: ${formatPower(unit.battery.power)}`,
    );

    console.log(
      `Battery charging power: ${formatPower(unit.battery.chargePower)}`,
    );

    console.log(
      `Battery discharging power: ${formatPower(unit.battery.dischargePower)}`,
    );

    console.log(
      `Battery state of energy: ${
        unit.battery.stateOfEnergy === undefined
          ? 'Not available'
          : `${formatNumber(unit.battery.stateOfEnergy)} %`
      }`,
    );
  }

}

/**
 * Prints plant-wide calculated values.
 */
function printTotals(
  snapshot: SolarEdgePlantSnapshot,
): void {

  console.log(
    '\nPlant totals',
  );

  console.log(
    `Inverter AC power: ${formatPower(snapshot.inverterAcPower)}`,
  );

  console.log(
    `Inverter DC power: ${formatPower(snapshot.inverterDcPower)}`,
  );

  console.log(
    `Estimated PV power: ${formatPower(snapshot.solarPowerEstimate)}`,
  );

  console.log(
    `Site consumption: ${formatPower(snapshot.consumptionPower)}`,
  );

  console.log(
    `Grid import: ${formatPower(snapshot.gridImportPower)}`,
  );

  console.log(
    `Grid export: ${formatPower(snapshot.gridExportPower)}`,
  );

  console.log(
    `Signed battery power: ${formatPower(snapshot.batteryPower)}`,
  );

  console.log(
    `Battery charging power: ${formatPower(snapshot.batteryChargePower)}`,
  );

  console.log(
    `Battery discharging power: ${formatPower(snapshot.batteryDischargePower)}`,
  );

  console.log(
    `Battery rated energy: ${formatEnergy(snapshot.batteryRatedEnergy)}`,
  );

  console.log(
    `Battery stored energy: ${formatEnergy(snapshot.batteryStoredEnergy)}`,
  );

  console.log(
    `Battery state of energy: ${
      snapshot.batteryStateOfEnergy === undefined
        ? 'Not available'
        : `${formatNumber(snapshot.batteryStateOfEnergy)} %`
    }`,
  );

}

/**
 * Reads and prints one complete SolarEdge plant snapshot.
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

  console.log(
    `Target: ${host}:${port}`,
  );

  console.log(
    `Inverter units: ${unitIds.join(', ')}`,
  );

  console.log(
    `Meter unit: ${meterUnitId}`,
  );

  console.log(
    'Connecting and discovering the SolarEdge plant...',
  );

  const client =
    await SolarEdgePlantClient
      .connect({
        host,
        port,
        unitIds,
        meterUnitId,
        baseAddresses: [
          40000,
          0,
        ],
      });

  console.log(
    'Connected. All configured inverter units were discovered.',
  );

  try {

    console.log(
      'Reading the complete plant snapshot...',
    );

    const snapshot =
      await client.snapshot();

    console.log(
      'Plant snapshot read successfully.',
    );

    console.log(
      '\n=== SolarEdge Plant Snapshot ===\n',
    );

    printUnits(
      snapshot,
    );

    printTotals(
      snapshot,
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
        '\nPlant snapshot failed:',
      );

      console.error(
        message,
      );

      process.exitCode = 1;

    },
  );
