import { ModbusFunctionCode } from './ModbusFunctionCode.js';

/**
 * Represents a complete Modbus TCP frame.
 *
 * This class only stores protocol data.
 */
export class ModbusTcpFrame {
  constructor(
    public readonly transactionId: number,
    public readonly protocolId: number,
    public readonly unitId: number,
    public readonly functionCode: ModbusFunctionCode,
    public readonly data: Buffer,
  ) {}
}