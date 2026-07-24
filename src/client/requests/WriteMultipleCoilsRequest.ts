import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Creates a request for Modbus function code 0x0F
 * (Write Multiple Coils).
 */
export class WriteMultipleCoilsRequest {
  /**
   * Creates a Modbus request for writing multiple coils.
   *
   * @param unitId Modbus unit identifier.
   * @param address Start coil address.
   * @param values Coil values.
   */
  public static create(
    unitId: number,
    address: number,
    values: boolean[],
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

    if (values.length < 1 || values.length > 1968) {
      throw new RangeError(
        'Values must contain between 1 and 1968 coils.',
      );
    }

    for (const value of values) {
      if (typeof value !== 'boolean') {
        throw new TypeError(
          'Every value must be a boolean.',
        );
      }
    }

    const quantity = values.length;
    const byteCount =
      Math.ceil(quantity / 8);

    const data =
      Buffer.alloc(
        5 + byteCount,
      );

    data.writeUInt16BE(
      address,
      0,
    );

    data.writeUInt16BE(
      quantity,
      2,
    );

    data.writeUInt8(
      byteCount,
      4,
    );

    values.forEach(
      (
        value,
        index,
      ) => {
        if (!value) {
          return;
        }

        const byteIndex =
          5 + Math.floor(index / 8);

        const bitIndex =
          index % 8;

        data[byteIndex] |=
          1 << bitIndex;
      },
    );

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.WriteMultipleCoils,
      data,
    );
  }
}