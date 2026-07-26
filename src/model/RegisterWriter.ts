import type { ModbusClient } from '../client/ModbusClient.js';
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

}