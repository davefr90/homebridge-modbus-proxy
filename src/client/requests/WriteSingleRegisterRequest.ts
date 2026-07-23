import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Creates a request for Modbus function code 0x06
 * (Write Single Register).
 */
export class WriteSingleRegisterRequest {
  /**
   * Creates a Modbus request for writing one 16-bit register.
   *
   * @param unitId Modbus unit identifier.
   * @param address Register address.
   * @param value Unsigned 16-bit register value.
   */
  public static create(
    unitId: number,
    address: number,
    value: number,
  ): ModbusRequest {
    if (!Number.isInteger(unitId) || unitId < 0 || unitId > 0xff) {
      throw new RangeError(
        'Unit ID must be an integer between 0 and 255.',
      );
    }

    if (!Number.isInteger(address) || address < 0 || address > 0xffff) {
      throw new RangeError(
        'Address must be an integer between 0 and 65535.',
      );
    }

    if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
      throw new RangeError(
        'Value must be an integer between 0 and 65535.',
      );
    }

    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(value, 2);

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.WriteSingleRegister,
      data,
    );
  }
}