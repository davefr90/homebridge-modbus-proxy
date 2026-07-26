/**
 * Runtime configuration for a Modbus device.
 */
export interface DeviceConfiguration {

  /**
   * Unique device identifier.
   */
  id: string;

  /**
   * Device type.
   */
  type: string;

  /**
   * Hostname or IP address.
   */
  host: string;

  /**
   * TCP port.
   */
  port: number;

  /**
   * Modbus unit id.
   */
  unitId: number;

}