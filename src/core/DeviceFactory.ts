import { DeviceConfig } from '../config/DeviceConfig.js';
import { Device } from './Device.js';

/**
 * Creates Device instances from a DeviceConfig.
 */
export class DeviceFactory {

  /**
   * Creates a new Device from the supplied configuration.
   */
  public static create(config: DeviceConfig): Device {

    return new Device(
      config.name,
      config.host,
      config.port,
      config.unitId,
    );

  }

}