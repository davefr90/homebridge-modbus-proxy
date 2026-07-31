import type { ModbusClient } from '../client/ModbusClient.js';
import { PollFunction } from '../polling/PollFunction.js';
import type { RegisterDefinition } from './RegisterDefinition.js';
import { ValueConverter } from './ValueConverter.js';

/**
 * Reads and decodes Modbus register values.
 */
export class RegisterReader {

  public constructor(
    private readonly client: ModbusClient,
    private readonly converter = new ValueConverter(),
  ) {}

  /**
   * Reads a register value.
   */
  public async read(
    definition: RegisterDefinition,
  ): Promise<boolean | number | string> {

    switch (definition.function) {

    case PollFunction.ReadHoldingRegisters: {

      const values =
          await this.client.readHoldingRegisters(
            definition.unitId,
            definition.address,
            definition.length,
          );

      return this.converter.convert(
        definition,
        Uint16Array.from(values),
      );

    }

    case PollFunction.ReadInputRegisters: {

      const values =
          await this.client.readInputRegisters(
            definition.unitId,
            definition.address,
            definition.length,
          );

      return this.converter.convert(
        definition,
        Uint16Array.from(values),
      );

    }

    case PollFunction.ReadCoils: {

      const values =
          await this.client.readCoils(
            definition.unitId,
            definition.address,
            definition.length,
          );

      const value =
          values[0];

      if (value === undefined) {
        throw new Error(
          `No coil value returned for register: ${definition.name}`,
        );
      }

      return value;

    }

    case PollFunction.ReadDiscreteInputs: {

      const values =
          await this.client.readDiscreteInputs(
            definition.unitId,
            definition.address,
            definition.length,
          );

      const value =
          values[0];

      if (value === undefined) {
        throw new Error(
          `No discrete input value returned for register: ${definition.name}`,
        );
      }

      return value;

    }

    default:

      throw new Error(
        `Unsupported poll function: ${definition.function}`,
      );

    }

  }

}