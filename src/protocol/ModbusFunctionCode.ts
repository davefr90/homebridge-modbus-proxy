/**
 * Supported Modbus function codes.
 */
export enum ModbusFunctionCode {
  /**
   * Read Holding Registers.
   */
  ReadHoldingRegisters = 0x03,

  /**
   * Read Input Registers.
   */
  ReadInputRegisters = 0x04,

  /**
   * Write Single Register.
   */
  WriteSingleRegister = 0x06,

  /**
   * Write Multiple Registers.
   */
  WriteMultipleRegisters = 0x10,
}
