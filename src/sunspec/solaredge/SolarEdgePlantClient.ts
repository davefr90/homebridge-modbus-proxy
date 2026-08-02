import {
  ModbusClient,
} from '../../client/ModbusClient.js';

import type {
  SunSpecDevice,
} from '../devices/SunSpecDevice.js';

import {
  SunSpecDiscovery,
} from '../discovery/SunSpecDiscovery.js';

import type {
  SolarEdgePlantSnapshot,
  SolarEdgePlantUnitSnapshot,
} from '../models/snapshots/SolarEdgePlantSnapshot.js';

import {
  SunSpecDeviceFactory,
} from '../SunSpecDeviceFactory.js';

import {
  SolarEdgeBatteryDiscovery,
} from './SolarEdgeBatteryDiscovery.js';

import type {
  SolarEdgePlantClientOptions,
} from './SolarEdgePlantClientOptions.js';

import {
  SolarEdgePlantSnapshotCalculator,
} from './SolarEdgePlantSnapshotCalculator.js';

/**
 * Fully normalized SolarEdge plant client options.
 */
interface NormalizedSolarEdgePlantClientOptions {

  readonly host: string;

  readonly port: number;

  readonly unitIds: readonly number[];

  readonly meterUnitId: number;

  readonly baseAddresses: readonly number[];

  readonly meterConsistencyThresholdWatts:
    number;

  readonly snapshotRetryCount: number;

}

/**
 * Reads and aggregates a multi-inverter SolarEdge plant over
 * one shared Modbus TCP connection.
 */
export class SolarEdgePlantClient {

  private constructor(

    private readonly modbusClient:
      ModbusClient,

    private readonly clientOptions:
      NormalizedSolarEdgePlantClientOptions,

    private readonly plantDevices:
      ReadonlyMap<number, SunSpecDevice>,

  ) {
  }

  /**
   * Connects once and discovers all configured inverter units
   * sequentially on the shared socket.
   */
  public static async connect(
    options: SolarEdgePlantClientOptions,
  ): Promise<SolarEdgePlantClient> {

    const normalizedOptions =
      SolarEdgePlantClient
        .normalizeOptions(
          options,
        );

    const modbusClient =
      new ModbusClient(
        normalizedOptions.host,
        normalizedOptions.port,
      );

    await modbusClient.connect();

    try {

      const discovery =
        new SunSpecDiscovery(
          modbusClient,
          {
            baseAddresses:
              normalizedOptions.baseAddresses,
          },
        );

      const devices =
        new Map<number, SunSpecDevice>();

      for (
        const unitId
        of normalizedOptions.unitIds
      ) {

        const discoveryResult =
          await discovery.discover(
            unitId,
          );

        const batteryDiscoveryResult =
          await SolarEdgeBatteryDiscovery
            .discover(
              modbusClient,
              unitId,
            );

        devices.set(
          unitId,
          SunSpecDeviceFactory.create(
            discoveryResult,
            modbusClient,
            batteryDiscoveryResult
              ?.baseAddress,
          ),
        );

      }

      return new SolarEdgePlantClient(
        modbusClient,
        normalizedOptions,
        devices,
      );

    } catch (error) {

      await SolarEdgePlantClient
        .disconnectAfterFailure(
          modbusClient,
        );

      throw error;

    }

  }

  /**
   * Reads the meter before and after all sequential unit
   * snapshots. A large meter change invalidates the frame and
   * triggers an immediate retry so values from different plant
   * states are not combined.
   */
  public async snapshot():
    Promise<SolarEdgePlantSnapshot> {

    const maximumAttempts =
      this.clientOptions
        .snapshotRetryCount
      + 1;

    let lastMeterChange = 0;

    for (
      let attempt = 1;
      attempt <= maximumAttempts;
      attempt += 1
    ) {

      const meterBefore =
        await this.readMeterSnapshot();

      const units =
        await this.readUnitSnapshots();

      const meterAfter =
        await this.readMeterSnapshot();

      lastMeterChange =
        Math.abs(
          meterAfter.activePower
          - meterBefore.activePower,
        );

      if (
        lastMeterChange
        <= this.clientOptions
          .meterConsistencyThresholdWatts
      ) {
        return SolarEdgePlantSnapshotCalculator
          .calculate(
            units,
            meterAfter,
          );
      }

    }

    throw new Error(
      'SolarEdge plant changed by '
      + `${lastMeterChange} W while the snapshot was read; `
      + 'the permitted meter change is '
      + `${this.clientOptions.meterConsistencyThresholdWatts} W `
      + `after ${maximumAttempts} attempts.`,
    );

  }

  /**
   * Reads all inverter and optional battery blocks in their
   * configured order.
   */
  private async readUnitSnapshots():
    Promise<SolarEdgePlantUnitSnapshot[]> {

    const units:
      SolarEdgePlantUnitSnapshot[] = [];

    for (
      const unitId
      of this.clientOptions.unitIds
    ) {

      const device =
        this.device(
          unitId,
        );

      const inverter =
        await device.inverter
          .snapshot();

      const battery =
        device.battery === undefined
          ? undefined
          : await device.battery
            .snapshot();

      units.push({
        unitId,
        inverter,

        ...(battery === undefined
          ? {}
          : {
            battery,
          }),
      });

    }

    return units;

  }

  /**
   * Reads the shared site meter used as the consistency frame
   * around all inverter units.
   */
  private async readMeterSnapshot():
    Promise<SolarEdgePlantSnapshot['meter']> {

    const meterUnitId =
      this.clientOptions
        .meterUnitId;

    const meter =
      this.device(
        meterUnitId,
      ).meter;

    if (meter === undefined) {
      throw new Error(
        `SolarEdge meter model 203 was not found on unit ${meterUnitId}.`,
      );
    }

    return meter.snapshot();

  }

  /**
   * Returns one discovered inverter unit.
   */
  public device(
    unitId: number,
  ): SunSpecDevice {

    const device =
      this.plantDevices.get(
        unitId,
      );

    if (device === undefined) {
      throw new Error(
        `SolarEdge plant unit was not discovered: ${unitId}`,
      );
    }

    return device;

  }

  /**
   * Returns configured inverter unit identifiers.
   */
  public unitIds():
    readonly number[] {

    return this.clientOptions
      .unitIds;

  }

  /**
   * Returns normalized connection and topology options.
   */
  public get options():
    Readonly<NormalizedSolarEdgePlantClientOptions> {

    return this.clientOptions;

  }

  /**
   * Returns whether the shared Modbus connection is active.
   */
  public get isConnected():
    boolean {

    return this.modbusClient
      .isConnected;

  }

  /**
   * Disconnects the shared Modbus TCP connection.
   */
  public async disconnect():
    Promise<void> {

    await this.modbusClient
      .disconnect();

  }

  /**
   * Applies defaults and validates topology options.
   */
  private static normalizeOptions(
    options: SolarEdgePlantClientOptions,
  ): NormalizedSolarEdgePlantClientOptions {

    const host =
      options.host.trim();

    const port =
      options.port
      ?? 502;

    const unitIds =
      options.unitIds
      ?? [
        2,
        3,
      ];

    const meterUnitId =
      options.meterUnitId
      ?? unitIds[0];

    const baseAddresses =
      options.baseAddresses
      ?? [
        40000,
        0,
      ];

    const meterConsistencyThresholdWatts =
      options.meterConsistencyThresholdWatts
      ?? 500;

    const snapshotRetryCount =
      options.snapshotRetryCount
      ?? 1;

    if (host.length === 0) {
      throw new Error(
        'SolarEdge plant host must not be empty.',
      );
    }

    if (
      !Number.isInteger(port)
      || port < 1
      || port > 65535
    ) {
      throw new Error(
        `Invalid Modbus TCP port: ${port}`,
      );
    }

    if (unitIds.length === 0) {
      throw new Error(
        'At least one SolarEdge plant unit ID is required.',
      );
    }

    const uniqueUnitIds =
      new Set<number>();

    for (const unitId of unitIds) {
      SolarEdgePlantClient
        .validateUnitId(
          unitId,
        );

      if (uniqueUnitIds.has(unitId)) {
        throw new Error(
          `Duplicate SolarEdge plant unit ID: ${unitId}`,
        );
      }

      uniqueUnitIds.add(
        unitId,
      );
    }

    if (
      meterUnitId === undefined
      || !uniqueUnitIds.has(meterUnitId)
    ) {
      throw new Error(
        `Meter unit ID is not part of the SolarEdge plant: ${String(meterUnitId)}`,
      );
    }

    if (baseAddresses.length === 0) {
      throw new Error(
        'At least one SunSpec base address is required.',
      );
    }

    for (const baseAddress of baseAddresses) {
      if (
        !Number.isInteger(baseAddress)
        || baseAddress < 0
        || baseAddress > 65532
      ) {
        throw new Error(
          `Invalid SunSpec base address: ${baseAddress}`,
        );
      }
    }

    if (
      !Number.isFinite(
        meterConsistencyThresholdWatts,
      )
      || meterConsistencyThresholdWatts < 0
    ) {
      throw new Error(
        'Meter consistency threshold must be a finite non-negative number.',
      );
    }

    if (
      !Number.isInteger(
        snapshotRetryCount,
      )
      || snapshotRetryCount < 0
    ) {
      throw new Error(
        'Snapshot retry count must be a non-negative integer.',
      );
    }

    return {
      host,
      port,

      unitIds:
        Object.freeze(
          [...unitIds],
        ),

      meterUnitId,

      baseAddresses:
        Object.freeze(
          [...baseAddresses],
        ),

      meterConsistencyThresholdWatts,
      snapshotRetryCount,
    };

  }

  private static validateUnitId(
    unitId: number,
  ): void {

    if (
      !Number.isInteger(unitId)
      || unitId < 1
      || unitId > 247
    ) {
      throw new Error(
        `Invalid Modbus unit ID: ${unitId}`,
      );
    }

  }

  /**
   * Closes a partially initialized connection without hiding
   * the original discovery error.
   */
  private static async disconnectAfterFailure(
    modbusClient: ModbusClient,
  ): Promise<void> {

    try {
      await modbusClient.disconnect();
    } catch {
      /* Preserve the original initialization error. */
    }

  }

}
