import { ModbusProtocolError } from '../../exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';
import { ModbusResponseParser } from './ModbusResponseParser.js';

/**
 * Parses responses for Modbus function code 0x0F
 * (Write Multiple Coils).
 *
 * A valid response contains the start address and the number
 * of coils written.
 */
export class WriteMultipleCoilsResponseParser
  extends ModbusResponseParser {

  /**
   * Validates a Write Multiple Coils response.
   *
   * @param frame Received Modbus TCP response frame.
   * @param expectedAddress Start address sent in the request.
   * @param expectedQuantity Number of coils sent in the request.
   */
  public static parse(
    frame: ModbusTcpFrame,
    expectedAddress: number,
    expectedQuantity: number,
  ): void {
    this.validateFunctionCode(
      frame,
      ModbusFunctionCode.WriteMultipleCoils,
    );

    if (frame.data.length !== 4) {
      throw new ModbusProtocolError(
        'Invalid Write Multiple Coils response length: ' +
        `received ${frame.data.length} data bytes, expected 4.`,
      );
    }

    const receivedAddress =
      frame.data.readUInt16BE(
        0,
      );

    const receivedQuantity =
      frame.data.readUInt16BE(
        2,
      );

    if (receivedAddress !== expectedAddress) {
      throw new ModbusProtocolError(
        'Invalid Write Multiple Coils response address: ' +
        `received ${receivedAddress}, expected ${expectedAddress}.`,
      );
    }

    if (receivedQuantity !== expectedQuantity) {
      throw new ModbusProtocolError(
        'Invalid Write Multiple Coils response quantity: ' +
        `received ${receivedQuantity}, expected ${expectedQuantity}.`,
      );
    }
  }
}