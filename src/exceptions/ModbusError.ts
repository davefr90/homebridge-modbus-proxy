/**
 * Base error class for Modbus-related errors.
 */
export class ModbusError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = new.target.name;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}