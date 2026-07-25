/**
 * Supported Modbus polling function codes.
 */
export enum PollFunction {
  ReadCoils = 1,

  ReadDiscreteInputs = 2,

  ReadHoldingRegisters = 3,

  ReadInputRegisters = 4,
}