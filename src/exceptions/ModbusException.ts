import { ModbusExceptionCode } from '../protocol/ModbusExceptionCode.js';

/**
 * Represents a Modbus exception response.
 */
export class ModbusException extends Error {
  /**
   * Modbus exception code returned by the server.
   */
  public readonly exceptionCode: ModbusExceptionCode;

  /**
   * Original Modbus function code without the exception bit.
   */
  public readonly functionCode: number;

  public constructor(
    functionCode: number,
    exceptionCode: ModbusExceptionCode,
    message?: string,
  ) {
    super(
      message ??
        `Modbus exception 0x${exceptionCode
          .toString(16)
          .padStart(2, '0')}`,
    );

    this.name = 'ModbusException';

    this.functionCode = functionCode;
    this.exceptionCode = exceptionCode;
  }
}