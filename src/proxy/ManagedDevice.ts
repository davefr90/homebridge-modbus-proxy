/**
 * Represents a managed Modbus TCP device.
 *
 * The DeviceManager stores one instance for every configured
 * Modbus device.
 */
export interface ManagedDevice {
  /**
   * Unique device identifier.
   */
  readonly id: string;

  /**
   * Human-readable device name.
   */
  readonly name: string;

  /**
   * IPv4 or hostname.
   */
  readonly host: string;

  /**
   * TCP port.
   */
  readonly port: number;

  /**
   * Default Modbus Unit Identifier.
   */
  readonly unitId: number;
}