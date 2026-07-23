/**
 * Represents the basic configuration of a Modbus TCP device.
 *
 * This class only stores device data.
 * It does not open network connections or execute Modbus requests.
 */
export class Device {
  constructor(
    public readonly name: string,
    public readonly host: string,
    public readonly port: number,
    public readonly unitId: number,
  ) {}
}