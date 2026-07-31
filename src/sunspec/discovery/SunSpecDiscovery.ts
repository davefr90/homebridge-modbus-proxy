import type {
  ModbusClient,
} from '../../client/ModbusClient.js';

import {
  CommonModel,
} from '../models/CommonModel.js';

import type {
  SunSpecDiscoveredModel,
} from './SunSpecDiscoveredModel.js';

import {
  SunSpecDiscoveryResult,
} from './SunSpecDiscoveryResult.js';

/**
 * Minimal Modbus client functionality required by discovery.
 */
export interface SunSpecDiscoveryClient {

  /**
   * Reads Modbus holding registers.
   */
  readHoldingRegisters(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<number[]>;

}

/**
 * Configuration for SunSpec discovery.
 */
export interface SunSpecDiscoveryOptions {

  /**
   * Candidate addresses at which the SunSpec identifier
   * should be searched.
   *
   * Default:
   * CommonModel.DEFAULT_BASE_ADDRESS
   */
  readonly baseAddresses?: readonly number[];

  /**
   * Maximum number of models that may be discovered.
   *
   * This prevents endless scanning when a device returns
   * invalid model headers.
   *
   * Default: 256
   */
  readonly maxModels?: number;

}

/**
 * Discovers a SunSpec model chain through Modbus TCP.
 */
export class SunSpecDiscovery {

  /**
   * First SunSpec identifier register.
   *
   * ASCII: "Su"
   */
  public static readonly IDENTIFIER_HIGH =
    0x5375;

  /**
   * Second SunSpec identifier register.
   *
   * ASCII: "nS"
   */
  public static readonly IDENTIFIER_LOW =
    0x6e53;

  /**
   * SunSpec end-model identifier.
   */
  public static readonly END_MODEL_ID =
    0xffff;

  private readonly baseAddresses:
    readonly number[];

  private readonly maxModels: number;

  /**
   * Creates a new SunSpec discovery service.
   */
  public constructor(
    private readonly client:
      SunSpecDiscoveryClient | ModbusClient,
    options: SunSpecDiscoveryOptions = {},
  ) {

    const configuredBaseAddresses =
      options.baseAddresses ??
      [
        CommonModel.DEFAULT_BASE_ADDRESS,
      ];

    this.baseAddresses =
      Object.freeze(
        [...configuredBaseAddresses],
      );

    this.maxModels =
      options.maxModels ??
      256;

    this.validateConfiguration();

  }

  /**
   * Searches the configured base addresses and discovers
   * the first valid SunSpec model chain.
   *
   * @param unitId Modbus unit identifier.
   */
  public async discover(
    unitId = 1,
  ): Promise<SunSpecDiscoveryResult> {

    this.validateUnitId(
      unitId,
    );

    const errors: Error[] =
      [];

    for (
      const baseAddress
      of this.baseAddresses
    ) {

      try {

        return await this.discoverAt(
          unitId,
          baseAddress,
        );

      } catch (error) {

        errors.push(
          error instanceof Error
            ? error
            : new Error(
              String(error),
            ),
        );

      }

    }

    const attemptedAddresses =
      this.baseAddresses.join(
        ', ',
      );

    const lastError =
      errors.at(-1);

    throw new Error(
      `No SunSpec device found for Modbus unit ${unitId} ` +
      `at base addresses: ${attemptedAddresses}.` +
      (
        lastError === undefined
          ? ''
          : ` Last error: ${lastError.message}`
      ),
    );

  }

  /**
   * Discovers a SunSpec model chain at one specific
   * base address.
   */
  public async discoverAt(
    unitId: number,
    baseAddress: number,
  ): Promise<SunSpecDiscoveryResult> {

    this.validateUnitId(
      unitId,
    );

    this.validateBaseAddress(
      baseAddress,
    );

    /*
     * Read:
     *
     * baseAddress + 0: SunSpec identifier high word
     * baseAddress + 1: SunSpec identifier low word
     * baseAddress + 2: first model ID
     * baseAddress + 3: first model length
     */
    const initialRegisters =
      await this.readRegisters(
        unitId,
        baseAddress,
        4,
      );

    this.validateIdentifier(
      initialRegisters[0],
      initialRegisters[1],
      baseAddress,
    );

    const models:
      SunSpecDiscoveredModel[] =
      [];

    let headerAddress =
      baseAddress + 2;

    let modelId =
      initialRegisters[2];

    let modelLength =
      initialRegisters[3];

    while (
      modelId !==
      SunSpecDiscovery.END_MODEL_ID
    ) {

      if (
        models.length >=
        this.maxModels
      ) {
        throw new Error(
          'SunSpec discovery exceeded the maximum of ' +
          `${this.maxModels} models.`,
        );
      }

      this.validateModelHeader(
        modelId,
        modelLength,
        headerAddress,
      );

      const dataAddress =
        headerAddress + 2;

      models.push({
        id:
          modelId,
        headerAddress,
        dataAddress,
        length:
          modelLength,
      });

      const nextHeaderAddress =
        dataAddress +
        modelLength;

      this.validateHeaderAddress(
        nextHeaderAddress,
      );

      const nextHeader =
        await this.readRegisters(
          unitId,
          nextHeaderAddress,
          2,
        );

      headerAddress =
        nextHeaderAddress;

      modelId =
        nextHeader[0];

      modelLength =
        nextHeader[1];

    }

    return new SunSpecDiscoveryResult(
      unitId,
      baseAddress,
      models,
    );

  }

  /**
   * Reads and validates an exact number of holding registers.
   */
  private async readRegisters(
    unitId: number,
    address: number,
    quantity: number,
  ): Promise<number[]> {

    const registers =
      await this.client
        .readHoldingRegisters(
          unitId,
          address,
          quantity,
        );

    if (
      registers.length !==
      quantity
    ) {
      throw new Error(
        `Invalid Modbus response at address ${address}: ` +
        `expected ${quantity} registers, ` +
        `received ${registers.length}.`,
      );
    }

    for (
      let index = 0;
      index < registers.length;
      index += 1
    ) {

      const value =
        registers[index];

      if (
        !Number.isInteger(
          value,
        )
        || value < 0
        || value > 0xffff
      ) {
        throw new Error(
          'Invalid Modbus register value at address ' +
          `${address + index}: ${value}`,
        );
      }

    }

    return registers;

  }

  /**
   * Validates the two-register SunSpec identifier.
   */
  private validateIdentifier(
    highWord: number,
    lowWord: number,
    baseAddress: number,
  ): void {

    if (
      highWord !==
        SunSpecDiscovery.IDENTIFIER_HIGH
      || lowWord !==
        SunSpecDiscovery.IDENTIFIER_LOW
    ) {
      const actualIdentifier =
        [
          highWord,
          lowWord,
        ]
          .map(
            (value) =>
              `0x${value
                .toString(16)
                .padStart(4, '0')}`,
          )
          .join(
            ' ',
          );

      throw new Error(
        'Invalid SunSpec identifier at address ' +
        `${baseAddress}: ${actualIdentifier}`,
      );
    }

  }

  /**
   * Validates one model header.
   */
  private validateModelHeader(
    modelId: number,
    modelLength: number,
    headerAddress: number,
  ): void {

    if (
      !Number.isInteger(
        modelId,
      )
      || modelId < 1
      || modelId >=
        SunSpecDiscovery.END_MODEL_ID
    ) {
      throw new Error(
        `Invalid SunSpec model ID ${modelId} ` +
        `at address ${headerAddress}.`,
      );
    }

    if (
      !Number.isInteger(
        modelLength,
      )
      || modelLength < 1
      || modelLength > 0xffff
    ) {
      throw new Error(
        `Invalid SunSpec model length ${modelLength} ` +
        `for model ${modelId} at address ` +
        `${headerAddress + 1}.`,
      );
    }

    const modelEndAddress =
      headerAddress +
      2 +
      modelLength;

    if (
      modelEndAddress >
      65535
    ) {
      throw new Error(
        `SunSpec model ${modelId} exceeds the ` +
        'Modbus address range.',
      );
    }

  }

  /**
   * Validates the address of a model header.
   */
  private validateHeaderAddress(
    address: number,
  ): void {

    /*
     * A model header consists of two registers. Therefore,
     * address 65535 cannot be used as a header start.
     */
    if (
      !Number.isInteger(
        address,
      )
      || address < 0
      || address > 65534
    ) {
      throw new Error(
        `Invalid SunSpec model header address: ${address}`,
      );
    }

  }

  /**
   * Validates the Modbus unit identifier.
   */
  private validateUnitId(
    unitId: number,
  ): void {

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

  }

  /**
   * Validates a SunSpec base address.
   */
  private validateBaseAddress(
    baseAddress: number,
  ): void {

    /*
     * Initial discovery reads four registers.
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

  /**
   * Validates discovery configuration.
   */
  private validateConfiguration(): void {

    if (
      this.baseAddresses.length === 0
    ) {
      throw new Error(
        'At least one SunSpec base address is required.',
      );
    }

    for (
      const baseAddress
      of this.baseAddresses
    ) {
      this.validateBaseAddress(
        baseAddress,
      );
    }

    if (
      !Number.isInteger(
        this.maxModels,
      )
      || this.maxModels < 1
    ) {
      throw new Error(
        `Invalid maximum SunSpec model count: ${this.maxModels}`,
      );
    }

  }

}