import type {
  NormalizedSolarEdgePlantPlatformConfiguration,
} from './SolarEdgePlantPlatformConfiguration.js';

/**
 * Validates and normalizes the optional SolarEdge section of
 * the Homebridge platform configuration.
 */
export class SolarEdgePlantPlatformConfigurationLoader {

  public load(
    value: unknown,
  ): NormalizedSolarEdgePlantPlatformConfiguration | undefined {

    if (value === undefined) {
      return undefined;
    }

    if (!SolarEdgePlantPlatformConfigurationLoader.isRecord(value)) {
      throw new Error(
        'SolarEdge plant configuration must be an object.',
      );
    }

    const host =
      SolarEdgePlantPlatformConfigurationLoader
        .readHost(
          value.host,
        );

    const port =
      SolarEdgePlantPlatformConfigurationLoader
        .readInteger(
          'SolarEdge Modbus TCP port',
          value.port,
          502,
          1,
          65535,
        );

    const unitIds =
      SolarEdgePlantPlatformConfigurationLoader
        .readUnitIds(
          value.unitIds,
        );

    const firstUnitId =
      unitIds[0];

    if (firstUnitId === undefined) {
      throw new Error(
        'At least one SolarEdge inverter unit ID is required.',
      );
    }

    const meterUnitId =
      SolarEdgePlantPlatformConfigurationLoader
        .readInteger(
          'SolarEdge meter unit ID',
          value.meterUnitId,
          firstUnitId,
          1,
          247,
        );

    if (!unitIds.includes(meterUnitId)) {
      throw new Error(
        `SolarEdge meter unit ID is not part of the inverter units: ${meterUnitId}`,
      );
    }

    const pollIntervalMs =
      SolarEdgePlantPlatformConfigurationLoader
        .readInteger(
          'SolarEdge polling interval',
          value.pollIntervalMs,
          5000,
          1000,
          Number.MAX_SAFE_INTEGER,
        );

    const meterConsistencyThresholdWatts =
      SolarEdgePlantPlatformConfigurationLoader
        .readFiniteNumber(
          'SolarEdge meter consistency threshold',
          value.meterConsistencyThresholdWatts,
          500,
          0,
        );

    const snapshotRetryCount =
      SolarEdgePlantPlatformConfigurationLoader
        .readInteger(
          'SolarEdge snapshot retry count',
          value.snapshotRetryCount,
          1,
          0,
          10,
        );

    return Object.freeze({
      host,
      port,

      unitIds:
        Object.freeze(
          [...unitIds],
        ),

      meterUnitId,
      pollIntervalMs,
      meterConsistencyThresholdWatts,
      snapshotRetryCount,
    });

  }

  private static readHost(
    value: unknown,
  ): string {

    if (typeof value !== 'string') {
      throw new Error(
        'SolarEdge plant host must be a string.',
      );
    }

    const host =
      value.trim();

    if (host.length === 0) {
      throw new Error(
        'SolarEdge plant host must not be empty.',
      );
    }

    return host;

  }

  private static readUnitIds(
    value: unknown,
  ): readonly number[] {

    const unitIds =
      value === undefined
        ? [
          2,
          3,
        ]
        : value;

    if (
      !Array.isArray(unitIds)
      || unitIds.length === 0
    ) {
      throw new Error(
        'At least one SolarEdge inverter unit ID is required.',
      );
    }

    const uniqueUnitIds =
      new Set<number>();

    for (const unitId of unitIds) {
      if (
        !Number.isInteger(unitId)
        || unitId < 1
        || unitId > 247
      ) {
        throw new Error(
          `Invalid SolarEdge inverter unit ID: ${String(unitId)}`,
        );
      }

      if (uniqueUnitIds.has(unitId)) {
        throw new Error(
          `Duplicate SolarEdge inverter unit ID: ${unitId}`,
        );
      }

      uniqueUnitIds.add(
        unitId,
      );
    }

    return [...uniqueUnitIds];

  }

  private static readInteger(
    name: string,
    value: unknown,
    defaultValue: number,
    minimum: number,
    maximum: number,
  ): number {

    const resolvedValue =
      value
      ?? defaultValue;

    if (
      !Number.isInteger(resolvedValue)
      || (resolvedValue as number) < minimum
      || (resolvedValue as number) > maximum
    ) {
      throw new Error(
        `${name} must be an integer between ${minimum} and ${maximum}.`,
      );
    }

    return resolvedValue as number;

  }

  private static readFiniteNumber(
    name: string,
    value: unknown,
    defaultValue: number,
    minimum: number,
  ): number {

    const resolvedValue =
      value
      ?? defaultValue;

    if (
      typeof resolvedValue !== 'number'
      || !Number.isFinite(resolvedValue)
      || resolvedValue < minimum
    ) {
      throw new Error(
        `${name} must be a finite number greater than or equal to ${minimum}.`,
      );
    }

    return resolvedValue;

  }

  private static isRecord(
    value: unknown,
  ): value is Record<string, unknown> {

    return typeof value === 'object'
      && value !== null
      && !Array.isArray(value);

  }

}
