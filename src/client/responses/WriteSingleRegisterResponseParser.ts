import { ModbusProtocolError } from '../../exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';
import { ModbusResponseParser } from './ModbusResponseParser.js';

/**
 * Parses responses for Modbus function code 0x06
 * (Write Single Register).
 *
 * A valid Modbus server response echoes the written register address
 * and register value.
 */
export class WriteSingleRegisterResponseParser
  extends ModbusResponseParser {

  /**
   * Validates a Write Single Register response.
   *
   * @param frame Received Modbus TCP response frame.
   * @param expectedAddress Register address sent in the request.
   * @param expectedValue Register value sent in the request.
   */
  public static parse(
    frame: ModbusTcpFrame,
    expectedAddress: number,
    expectedValue: number,
  ): void {
    this.validateFunctionCode(
      frame,
      ModbusFunctionCode.WriteSingleRegister,
    );

    if (frame.data.length !== 4) {
      throw new ModbusProtocolError(
        `Invalid Write Single Register response length: ` +
        `received ${frame.data.length} data bytes, expected 4.`,
      );
    }

    const receivedAddress = frame.data.readUInt16BE(0);
    const receivedValue = frame.data.readUInt16BE(2);

    if (receivedAddress !== expectedAddress) {
      throw new ModbusProtocolError(
        `Invalid Write Single Register response address: ` +
        `received ${receivedAddress}, expected ${expectedAddress}.`,
      );
    }

    if (receivedValue !== expectedValue) {
      throw new ModbusProtocolError(
        `Invalid Write Single Register response value: ` +
        `received ${receivedValue}, expected ${expectedValue}.`,
      );
    }
  }
}