/**
 * Standard Modbus function codes.
 */
export enum ModbusFunctionCode {
  ReadCoils = 0x01,
  ReadDiscreteInputs = 0x02,
  ReadHoldingRegisters = 0x03,
  ReadInputRegisters = 0x04,

  WriteSingleCoil = 0x05,
  WriteSingleRegister = 0x06,

  WriteMultipleCoils = 0x0F,
  WriteMultipleRegisters = 0x10,

  MaskWriteRegister = 0x16,

  ReadWriteMultipleRegisters = 0x17,

  ReadDeviceIdentification = 0x2B,
}