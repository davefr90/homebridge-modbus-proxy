import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusRequest } from '../ModbusRequest.js';

/**
 * Creates a request for Modbus function code 0x03
 * (Read Holding Registers).
 */
export class ReadHoldingRegistersRequest {
  /**
   * Creates a Modbus request.
   */
  public static create(
    unitId: number,
    address: number,
    quantity: number,
  ): ModbusRequest {
    if (unitId < 0 || unitId > 0xff) {
      throw new RangeError(
        'Unit ID must be between 0 and 255.',
      );
    }

    if (address < 0 || address > 0xffff) {
      throw new RangeError(
        'Address must be between 0 and 65535.',
      );
    }

    if (quantity < 1 || quantity > 125) {
      throw new RangeError(
        'Quantity must be between 1 and 125.',
      );
    }

    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(quantity, 2);

    return new ModbusRequest(
      unitId,
      ModbusFunctionCode.ReadHoldingRegisters,
      data,
    );
  }
}