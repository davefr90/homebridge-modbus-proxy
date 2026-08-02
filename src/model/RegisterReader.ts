import type { ModbusClient } from '../client/ModbusClient.js';
import { PollFunction } from '../polling/PollFunction.js';
import type { RegisterDefinition } from './RegisterDefinition.js';
import type { RegisterGroup } from './RegisterGroup.js';
import { ValueConverter } from './ValueConverter.js';

/**
 * Value returned for a decoded Modbus register.
 */
export type RegisterValue =
  boolean |
  number |
  string;

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
  ): Promise<RegisterValue> {

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

  /**
   * Reads one contiguous register group and decodes every
   * register definition from the returned block.
   */
  public async readGroup(
    group: RegisterGroup,
  ): Promise<
    ReadonlyMap<
      RegisterDefinition,
      RegisterValue
    >
  > {

    const values =
      await this.readGroupValues(
        group,
      );

    const result =
      new Map<
        RegisterDefinition,
        RegisterValue
      >();

    for (const definition of group.registers) {

      this.validateGroupDefinition(
        group,
        definition,
      );

      const offset =
        definition.address -
        group.startAddress;

      if (
        group.function ===
          PollFunction.ReadCoils ||
        group.function ===
          PollFunction.ReadDiscreteInputs
      ) {

        const value =
          values[offset];

        if (value === undefined) {
          throw new Error(
            `No boolean value returned for register: ${definition.name}`,
          );
        }

        result.set(
          definition,
          value !== 0,
        );

        continue;

      }

      const registerValues =
        values.slice(
          offset,
          offset + definition.length,
        );

      if (
        registerValues.length !==
        definition.length
      ) {
        throw new Error(
          `Insufficient values returned for register: ${definition.name}`,
        );
      }

      result.set(
        definition,
        this.converter.convert(
          definition,
          registerValues,
        ),
      );

    }

    return result;

  }

  /**
   * Executes the Modbus operation for a complete group.
   */
  private async readGroupValues(
    group: RegisterGroup,
  ): Promise<Uint16Array> {

    switch (group.function) {

    case PollFunction.ReadHoldingRegisters:

      return Uint16Array.from(
        await this.client.readHoldingRegisters(
          group.unitId,
          group.startAddress,
          group.length,
        ),
      );

    case PollFunction.ReadInputRegisters:

      return Uint16Array.from(
        await this.client.readInputRegisters(
          group.unitId,
          group.startAddress,
          group.length,
        ),
      );

    case PollFunction.ReadCoils:

      return Uint16Array.from(
        await this.client.readCoils(
          group.unitId,
          group.startAddress,
          group.length,
        ),
        (value) =>
          value ? 1 : 0,
      );

    case PollFunction.ReadDiscreteInputs:

      return Uint16Array.from(
        await this.client.readDiscreteInputs(
          group.unitId,
          group.startAddress,
          group.length,
        ),
        (value) =>
          value ? 1 : 0,
      );

    default:

      throw new Error(
        `Unsupported poll function: ${group.function}`,
      );

    }

  }

  /**
   * Ensures that a register definition is completely
   * contained in the supplied group.
   */
  private validateGroupDefinition(
    group: RegisterGroup,
    definition: RegisterDefinition,
  ): void {

    const groupEndExclusive =
      group.startAddress +
      group.length;

    const definitionEndExclusive =
      definition.address +
      definition.length;

    if (
      definition.unitId !== group.unitId ||
      definition.function !== group.function ||
      definition.address < group.startAddress ||
      definitionEndExclusive > groupEndExclusive
    ) {
      throw new Error(
        `Register is outside its read group: ${definition.name}`,
      );
    }

  }

}
