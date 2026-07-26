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
   * Validates, encodes and writes a value to a Modbus register.
   *
   * This initial implementation supports values that encode
   * into exactly one Modbus register.
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

    if (registers.length !== 1) {
      throw new Error(
        'Writing multiple registers is not supported yet.',
      );
    }

    await this.client.writeSingleRegister(
      definition.unitId,
      definition.address,
      registers[0],
    );

  }

}