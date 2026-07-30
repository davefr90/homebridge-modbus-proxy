import {
  ModbusClient,
} from '../client/ModbusClient.js';

import {
  SunSpecDevice,
} from './devices/SunSpecDevice.js';

import {
  SunSpecDiscovery,
} from './discovery/SunSpecDiscovery.js';

import type {
  SunSpecClientOptions,
} from './SunSpecClientOptions.js';

import {
  SunSpecDeviceFactory,
} from './SunSpecDeviceFactory.js';

import type {
  SunSpecPropertyName,
  SunSpecPropertyValue,
} from './SunSpecPropertyTypes.js';

/**
 * Public client for connecting to and interacting with
 * SunSpec-compatible Modbus TCP devices.
 */
export class SunSpecClient {

  private constructor(

    private readonly modbusClient:
      ModbusClient,

    private readonly clientOptions:
      Required<SunSpecClientOptions>,

    private readonly sunSpecDevice:
      SunSpecDevice,

  ) {
  }

  /**
   * Creates, connects and initializes a SunSpec client.
   *
   * Initialization performs:
   *
   * 1. Modbus TCP connection
   * 2. SunSpec discovery
   * 3. Supported model creation
   * 4. Logical device creation
   *
   * The Modbus connection is closed automatically if
   * initialization fails.
   */
  public static async connect(
    options: SunSpecClientOptions,
  ): Promise<SunSpecClient> {

    const normalizedOptions =
      SunSpecClient.normalizeOptions(
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

      const discoveryResult =
        await discovery.discover(
          normalizedOptions.unitId,
        );

      const sunSpecDevice =
        SunSpecDeviceFactory.create(
          discoveryResult,
          modbusClient,
        );

      return new SunSpecClient(
        modbusClient,
        normalizedOptions,
        sunSpecDevice,
      );

    } catch (error) {

      await SunSpecClient
        .disconnectAfterFailure(
          modbusClient,
        );

      throw error;

    }

  }

  /**
   * Reads a typed logical SunSpec device property.
   *
   * The return type is inferred from the supplied property.
   */
  public async read<
    TProperty extends SunSpecPropertyName,
  >(
    property: TProperty,
  ): Promise<
    SunSpecPropertyValue<TProperty>
  > {

    return this.sunSpecDevice.read(
      property,
    );

  }

  /**
   * Writes a logical SunSpec device property.
   *
   * Writable property typing will be introduced separately.
   */
  public async write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    await this.sunSpecDevice.write(
      property,
      value,
    );

  }

  /**
   * Disconnects the underlying Modbus TCP client.
   */
  public async disconnect():
    Promise<void> {

    await this.modbusClient
      .disconnect();

  }

  /**
   * Returns whether the Modbus TCP connection is active.
   */
  public get isConnected():
    boolean {

    return this.modbusClient
      .isConnected;

  }

  /**
   * Returns the normalized client options.
   */
  public get options():
    Readonly<
      Required<SunSpecClientOptions>
    > {

    return this.clientOptions;

  }

  /**
   * Returns the initialized SunSpec device.
   */
  public device():
    SunSpecDevice {

    return this.sunSpecDevice;

  }

  /**
   * Returns the underlying Modbus client.
   *
   * Intended for advanced use cases.
   */
  public modbus():
    ModbusClient {

    return this.modbusClient;

  }

  /**
   * Applies defaults and validates the supplied options.
   */
  private static normalizeOptions(
    options: SunSpecClientOptions,
  ): Required<SunSpecClientOptions> {

    const host =
      options.host.trim();

    const port =
      options.port ??
      502;

    const unitId =
      options.unitId ??
      1;

    const baseAddresses =
      options.baseAddresses ??
      [
        40000,
        0,
      ];

    if (
      host.length === 0
    ) {
      throw new Error(
        'SunSpec client host must not be empty.',
      );
    }

    if (
      !Number.isInteger(
        port,
      )
      || port < 1
      || port > 65535
    ) {
      throw new Error(
        `Invalid Modbus TCP port: ${port}`,
      );
    }

    if (
      !Number.isInteger(
        unitId,
      )
      || unitId < 1
      || unitId > 247
    ) {
      throw new Error(
        `Invalid Modbus unit ID: ${unitId}`,
      );
    }

    if (
      baseAddresses.length === 0
    ) {
      throw new Error(
        'At least one SunSpec base address is required.',
      );
    }

    for (
      const baseAddress
      of baseAddresses
    ) {

      /*
       * Discovery initially reads four registers starting
       * at the supplied base address.
       */
      if (
        !Number.isInteger(
          baseAddress,
        )
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
      unitId,

      baseAddresses:
        Object.freeze(
          [
            ...baseAddresses,
          ],
        ),
    };

  }

  /**
   * Attempts to close the Modbus connection after
   * initialization failed.
   *
   * A disconnect error must not replace the original
   * initialization error.
   */
  private static async disconnectAfterFailure(
    modbusClient: ModbusClient,
  ): Promise<void> {

    try {

      await modbusClient.disconnect();

    } catch {

      /*
       * Preserve the original initialization error.
       */

    }

  }

}