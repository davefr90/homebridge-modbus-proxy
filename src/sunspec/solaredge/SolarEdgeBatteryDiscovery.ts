import type {
  ModbusClient,
} from '../../client/ModbusClient.js';

import {
  ModbusException,
} from '../../exceptions/ModbusException.js';

import {
  SolarEdgeBatteryModel,
} from './SolarEdgeBatteryModel.js';

/**
 * Result of probing SolarEdge battery register blocks.
 */
export interface SolarEdgeBatteryDiscoveryResult {

  readonly baseAddress: number;

  readonly manufacturer: string;

}

/**
 * Detects the proprietary SolarEdge battery register block.
 */
export class SolarEdgeBatteryDiscovery {

  /**
   * Probes the primary battery block and its documented mirror.
   */
  public static async discover(
    client: ModbusClient,
    unitId: number,
  ): Promise<SolarEdgeBatteryDiscoveryResult | undefined> {

    const baseAddresses = [
      SolarEdgeBatteryModel.PRIMARY_BASE_ADDRESS,
      SolarEdgeBatteryModel.ALTERNATE_BASE_ADDRESS,
    ];

    for (const baseAddress of baseAddresses) {

      const manufacturer =
        await SolarEdgeBatteryDiscovery
          .tryReadManufacturer(
            client,
            unitId,
            baseAddress,
          );

      if (manufacturer === undefined) {
        continue;
      }

      return {
        baseAddress,
        manufacturer,
      };

    }

    return undefined;

  }

  /**
   * Reads and validates a battery manufacturer string.
   */
  private static async tryReadManufacturer(
    client: ModbusClient,
    unitId: number,
    baseAddress: number,
  ): Promise<string | undefined> {

    try {

      const registers =
        await client.readHoldingRegisters(
          unitId,
          baseAddress,
          16,
        );

      const manufacturer =
        SolarEdgeBatteryDiscovery
          .decodeAsciiString(
            registers,
          );

      return manufacturer === ''
        ? undefined
        : manufacturer;

    } catch (error: unknown) {

      if (error instanceof ModbusException) {
        return undefined;
      }

      throw error;

    }

  }

  /**
   * Decodes a printable SolarEdge register string.
   */
  private static decodeAsciiString(
    registers: readonly number[],
  ): string {

    const characters: string[] = [];

    for (const register of registers) {

      const bytes = [
        (register >> 8) & 0xFF,
        register & 0xFF,
      ];

      for (const byte of bytes) {

        if (
          byte === 0
          || byte === 0xFF
        ) {
          return characters
            .join('')
            .trim();
        }

        if (
          byte < 0x20
          || byte > 0x7E
        ) {
          return '';
        }

        characters.push(
          String.fromCharCode(
            byte,
          ),
        );

      }

    }

    return characters
      .join('')
      .trim();

  }

}
