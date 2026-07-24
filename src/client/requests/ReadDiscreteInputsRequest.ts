import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Factory for Modbus Read Discrete Inputs requests (Function Code 0x02).
 */
export class ReadDiscreteInputsRequest {
  /**
   * Creates a Read Discrete Inputs request.
   *
   * @param unitId Modbus unit identifier.
   * @param address First discrete input address.
   * @param quantity Number of discrete inputs to read.
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
      ModbusFunctionCode.ReadDiscreteInputs,
      data,
    );
  }
}