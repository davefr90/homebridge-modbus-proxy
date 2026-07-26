import type { DeviceConfiguration } from './DeviceConfiguration.js';

/**
 * Root proxy configuration.
 */
export interface ProxyConfiguration {

  /**
   * Configured devices.
   */
  devices: DeviceConfiguration[];

}