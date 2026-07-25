/**
 * Abstraction used by polling tasks to read Modbus data.
 */
export interface ModbusPollingClient {
  readCoils(
    unitId: number,
    startAddress: number,
    quantity: number,
  ): Promise<boolean[]>;

  readDiscreteInputs(
    unitId: number,
    startAddress: number,
    quantity: number,
  ): Promise<boolean[]>;

  readHoldingRegisters(
    unitId: number,
    startAddress: number,
    quantity: number,
  ): Promise<Uint16Array>;

  readInputRegisters(
    unitId: number,
    startAddress: number,
    quantity: number,
  ): Promise<Uint16Array>;
}