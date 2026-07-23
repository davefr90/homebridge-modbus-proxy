import { ModbusError } from './ModbusError.js';

/**
 * Error returned by a Modbus server as an exception response.
 */
export class ModbusExceptionResponseError extends ModbusError {
  public constructor(
    public readonly functionCode: number,
    public readonly exceptionCode: number,
  ) {
    super(
      `Modbus exception response received. ` +
      `Function code: ${functionCode}, ` +
      `exception code: ${exceptionCode}.`,
    );
  }
}