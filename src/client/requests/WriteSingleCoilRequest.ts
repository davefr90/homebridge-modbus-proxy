import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Factory for Modbus Write Single Coil requests (Function Code 0x05).
 */
export class WriteSingleCoilRequest {
  /**
   * Creates a Write Single Coil request.
   *
   * @param unitId Modbus unit identifier.
   * @param address Coil address.
   * @param value Coil value.
   */
  public static create(
    unitId: number,
    address: number,
    value: boolean,
  ): ModbusRequest {
    const data = Buffer.alloc(4);

    data.writeUInt16BE(
      address,
      0,
    );

    data.writeUInt16BE(
      value ? 0xff00 : 0x0000,
      2,
    );

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.WriteSingleCoil,
      data,
    );
  }
}