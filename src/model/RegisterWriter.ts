import type { ModbusClient } from '../client/ModbusClient.js';
import type { RegisterDefinition } from './RegisterDefinition.js';
import { ValueEncoder } from './ValueEncoder.js';
import { ValueValidator } from './ValueValidator.js';

/**
 * Encodes and writes values to Modbus registers.
 */
export class RegisterWriter {

  public constructor(
    private readonly client: ModbusClient,
    private readonly validator = new ValueValidator(),
    private readonly encoder = new ValueEncoder(),
  ) {}

  /**
   * Validates, encodes and writes a value to one or more
   * Modbus registers.
   */
  public async write(
    definition: RegisterDefinition,
    value: boolean | number | string,
  ): Promise<void> {

    this.validator.validate(
      definition,
      value,
    );

    const registers =
      this.encoder.encode(
        definition,
        value,
      );

    if (registers.length === 1) {

      await this.client.writeSingleRegister(
        definition.unitId,
        definition.address,
        registers[0],
      );

      return;

    }

    await this.client.writeMultipleRegisters(
      definition.unitId,
      definition.address,
      Array.from(registers),
    );

  }

}