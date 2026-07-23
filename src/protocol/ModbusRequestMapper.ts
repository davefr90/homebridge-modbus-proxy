import { ModbusRequest } from '../client/ModbusRequest.js';
import { MODBUS_PROTOCOL_ID } from './ModbusTcpConstants.js';
import { ModbusTcpFrame } from './ModbusTcpFrame.js';

/**
 * Maps a high-level Modbus request to a Modbus TCP frame.
 */
export class ModbusRequestMapper {
  public static toFrame(
    transactionId: number,
    request: ModbusRequest,
  ): ModbusTcpFrame {
    return new ModbusTcpFrame(
      transactionId,
      MODBUS_PROTOCOL_ID,
      request.unitId,
      request.functionCode,
      request.data,
    );
  }
}