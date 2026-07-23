import { ModbusProtocolError } from '../../exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';
import { ModbusResponseParser } from './ModbusResponseParser.js';

/**
 * Parses responses for Modbus function code 0x10
 * (Write Multiple Registers).
 *
 * A valid response contains the start address and the number
 * of registers written.
 */
export class WriteMultipleRegistersResponseParser
  extends ModbusResponseParser {

  /**
   * Validates a Write Multiple Registers response.
   *
   * @param frame Received Modbus TCP response frame.
   * @param expectedAddress Start address sent in the request.
   * @param expectedQuantity Number of registers sent in the request.
   */
  public static parse(
    frame: ModbusTcpFrame,
    expectedAddress: number,
    expectedQuantity: number,
  ): void {
    this.validateFunctionCode(
      frame,
      ModbusFunctionCode.WriteMultipleRegisters,
    );

    if (frame.data.length !== 4) {
      throw new ModbusProtocolError(
        `Invalid Write Multiple Registers response length: ` +
        `received ${frame.data.length} data bytes, expected 4.`,
      );
    }

    const receivedAddress = frame.data.readUInt16BE(0);
    const receivedQuantity = frame.data.readUInt16BE(2);

    if (receivedAddress !== expectedAddress) {
      throw new ModbusProtocolError(
        `Invalid Write Multiple Registers response address: ` +
        `received ${receivedAddress}, expected ${expectedAddress}.`,
      );
    }

    if (receivedQuantity !== expectedQuantity) {
      throw new ModbusProtocolError(
        `Invalid Write Multiple Registers response quantity: ` +
        `received ${receivedQuantity}, expected ${expectedQuantity}.`,
      );
    }
  }
}