import { ModbusProtocolError } from '../../exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';
import { ModbusResponseParser } from './ModbusResponseParser.js';

/**
 * Parses responses for Modbus function code 0x03
 * (Read Holding Registers).
 */
export class ReadHoldingRegistersResponseParser
  extends ModbusResponseParser {

  /**
   * Parses a Modbus TCP response frame and returns the register values.
   */
  public static parse(
    frame: ModbusTcpFrame,
    expectedQuantity: number,
  ): number[] {

    this.validateFunctionCode(
      frame,
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    if (frame.data.length < 1) {
      throw new ModbusProtocolError(
        'Invalid Read Holding Registers response: byte count is missing.',
      );
    }

    const byteCount = frame.data.readUInt8(0);
    const expectedByteCount = expectedQuantity * 2;

    if (byteCount !== expectedByteCount) {
      throw new ModbusProtocolError(
        `Invalid Read Holding Registers response: ` +
        `received byte count ${byteCount}, ` +
        `expected ${expectedByteCount}.`,
      );
    }

    if (frame.data.length !== byteCount + 1) {
      throw new ModbusProtocolError(
        `Invalid Read Holding Registers response length: ` +
        `received ${frame.data.length} data bytes, ` +
        `expected ${byteCount + 1}.`,
      );
    }

    const registers: number[] = [];

    for (let offset = 1; offset < frame.data.length; offset += 2) {
      registers.push(
        frame.data.readUInt16BE(offset),
      );
    }

    return registers;
  }
}