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
   * Reads each unit and model sequentially, then calculates
   * the plant-wide totals.
   */
  public async snapshot():
    Promise<SolarEdgePlantSnapshot> {

    const units:
      SolarEdgePlantUnitSnapshot[] = [];

    let meterSnapshot:
      SolarEdgePlantSnapshot['meter']
      | undefined;

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

      if (
        unitId ===
        this.clientOptions.meterUnitId
      ) {

        if (device.meter === undefined) {
          throw new Error(
            `SolarEdge meter model 203 was not found on unit ${unitId}.`,
          );
        }

        meterSnapshot =
          await device.meter
            .snapshot();

      }

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

    if (meterSnapshot === undefined) {
      throw new Error(
        `No meter snapshot was read from unit ${this.clientOptions.meterUnitId}.`,
      );
    }

    return SolarEdgePlantSnapshotCalculator
      .calculate(
        units,
        meterSnapshot,
      );

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
