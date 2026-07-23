import { ModbusFunctionCode } from '../protocol/ModbusFunctionCode.js';

/**
 * Represents a Modbus request before it is encoded into a TCP frame.
 */
export class ModbusRequest {
  constructor(
    public readonly unitId: number,
    public readonly functionCode: ModbusFunctionCode,
    public readonly data: Buffer,
  ) {}
}