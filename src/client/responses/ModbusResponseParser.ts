import { ModbusExceptionResponseError } from '../../exceptions/ModbusExceptionResponseError.js';
import { ModbusProtocolError } from '../../exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';

/**
 * Base class for Modbus response parsers.
 */
export abstract class ModbusResponseParser {
  /**
   * Validates the function code and checks for Modbus exception responses.
   */
  protected static validateFunctionCode(
    frame: ModbusTcpFrame,
    expectedFunctionCode: ModbusFunctionCode,
  ): void {
    const exceptionFunctionCode =
      expectedFunctionCode | 0x80;

    if (frame.functionCode === exceptionFunctionCode) {
      this.throwModbusException(frame);
    }

    if (frame.functionCode !== expectedFunctionCode) {
      throw new ModbusProtocolError(
        `Unexpected Modbus function code: ${frame.functionCode}. ` +
        `Expected ${expectedFunctionCode}.`,
      );
    }
  }

  /**
   * Throws an exception for a Modbus exception response.
   */
  protected static throwModbusException(
    frame: ModbusTcpFrame,
  ): never {
    if (frame.data.length < 1) {
      throw new ModbusProtocolError(
        'Invalid Modbus exception response: exception code is missing.',
      );
    }

    const exceptionCode = frame.data.readUInt8(0);

    throw new ModbusExceptionResponseError(
      frame.functionCode,
      exceptionCode,
    );
  }
}