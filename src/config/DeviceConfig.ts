/**
 * Configuration values for a Modbus TCP device.
 *
 * This interface describes the values that can later be loaded
 * from the Homebridge configuration.
 */
export interface DeviceConfig {
  name: string;
  host: string;
  port: number;
  unitId: number;
  timeout: number;
  reconnectInterval: number;
  maxRetries: number;
  enabled: boolean;
}