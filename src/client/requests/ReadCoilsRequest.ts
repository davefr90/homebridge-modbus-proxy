import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Factory for Modbus Read Coils requests (Function Code 0x01).
 */
export class ReadCoilsRequest {
  /**
   * Creates a Read Coils request.
   *
   * @param unitId Modbus unit identifier.
   * @param address First coil address.
   * @param quantity Number of coils to read.
   */
  public static create(
    unitId: number,
    address: number,
    quantity: number,
  ): ModbusRequest {
    const data = Buffer.alloc(4);

    data.writeUInt16BE(
      address,
      0,
    );

    data.writeUInt16BE(
      quantity,
      2,
    );

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.ReadCoils,
      data,
    );
  }
}