import {
  DATA_OFFSET,
  FUNCTION_CODE_OFFSET,
  FUNCTION_CODE_SIZE,
  LENGTH_OFFSET,
  MBAP_HEADER_SIZE,
  PROTOCOL_ID_OFFSET,
  TRANSACTION_ID_OFFSET,
  UNIT_ID_OFFSET,
} from './ModbusTcpConstants.js';
import { ModbusTcpFrame } from './ModbusTcpFrame.js';

/**
 * Encodes a Modbus TCP frame into a network buffer.
 */
export class ModbusTcpEncoder {

  /**
   * Encodes a frame into its binary representation.
   */
  public static encode(frame: ModbusTcpFrame): Buffer {

    const length = FUNCTION_CODE_SIZE + 1 + frame.data.length;
    const buffer = Buffer.alloc(
      MBAP_HEADER_SIZE + FUNCTION_CODE_SIZE + frame.data.length,
    );

    buffer.writeUInt16BE(frame.transactionId, TRANSACTION_ID_OFFSET);
    buffer.writeUInt16BE(frame.protocolId, PROTOCOL_ID_OFFSET);
    buffer.writeUInt16BE(length, LENGTH_OFFSET);
    buffer.writeUInt8(frame.unitId, UNIT_ID_OFFSET);
    buffer.writeUInt8(frame.functionCode, FUNCTION_CODE_OFFSET);

    frame.data.copy(buffer, DATA_OFFSET);

    return buffer;
  }

}