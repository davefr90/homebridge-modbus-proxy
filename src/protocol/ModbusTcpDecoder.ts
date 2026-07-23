import {
  DATA_OFFSET,
  FUNCTION_CODE_OFFSET,
  LENGTH_OFFSET,
  MIN_FRAME_SIZE,
  PREFIX_SIZE,
  PROTOCOL_ID_OFFSET,
  TRANSACTION_ID_OFFSET,
  UNIT_ID_OFFSET,
} from './ModbusTcpConstants.js';
import { ModbusTcpFrame } from './ModbusTcpFrame.js';

/**
 * Decodes a network buffer into a Modbus TCP frame.
 */
export class ModbusTcpDecoder {

  /**
   * Decodes a complete Modbus TCP frame.
   */
  public static decode(buffer: Buffer): ModbusTcpFrame {

    if (buffer.length < MIN_FRAME_SIZE) {
      throw new Error('Modbus TCP frame is too short');
    }

    const transactionId = buffer.readUInt16BE(TRANSACTION_ID_OFFSET);
    const protocolId = buffer.readUInt16BE(PROTOCOL_ID_OFFSET);
    const length = buffer.readUInt16BE(LENGTH_OFFSET);
    const unitId = buffer.readUInt8(UNIT_ID_OFFSET);
    const functionCode = buffer.readUInt8(FUNCTION_CODE_OFFSET);

    const expectedLength = PREFIX_SIZE + length;

    if (buffer.length !== expectedLength) {
      throw new Error(
        `Invalid Modbus TCP frame length: expected ${expectedLength} bytes, received ${buffer.length}`,
      );
    }

    const data = buffer.subarray(DATA_OFFSET);

    return new ModbusTcpFrame(
      transactionId,
      protocolId,
      unitId,
      functionCode,
      data,
    );
  }

}