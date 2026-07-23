import { ModbusError } from './ModbusError.js';

/**
 * Error thrown when a received Modbus response
 * violates the Modbus protocol specification.
 */
export class ModbusProtocolError extends ModbusError {
  public constructor(message: string) {
    super(message);
  }
}