import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Creates a request for Modbus function code 0x10
 * (Write Multiple Registers).
 */
export class WriteMultipleRegistersRequest {
  /**
   * Creates a Modbus request for writing multiple 16-bit registers.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start register address.
   * @param values Unsigned 16-bit register values.
   */
  public static create(
    unitId: number,
    address: number,
    values: number[],
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

    if (!Array.isArray(values)) {
      throw new TypeError(
        'Values must be an array.',
      );
    }

    if (values.length < 1 || values.length > 123) {
      throw new RangeError(
        'Values must contain between 1 and 123 registers.',
      );
    }

    for (const value of values) {
      if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
        throw new RangeError(
          'Every value must be an integer between 0 and 65535.',
        );
      }
    }

    const quantity = values.length;
    const byteCount = quantity * 2;
    const data = Buffer.alloc(5 + byteCount);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(quantity, 2);
    data.writeUInt8(byteCount, 4);

    values.forEach((value, index) => {
      data.writeUInt16BE(
        value,
        5 + (index * 2),
      );
    });

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.WriteMultipleRegisters,
      data,
    );
  }
}