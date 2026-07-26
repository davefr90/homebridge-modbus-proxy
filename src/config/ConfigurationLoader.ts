import type { ProxyConfiguration } from './ProxyConfiguration.js';

/**
 * Validates proxy configurations.
 */
export class ConfigurationLoader {

  /**
   * Validates a configuration object.
   */
  public load(
    configuration: ProxyConfiguration,
  ): ProxyConfiguration {

    for (
      const device of configuration.devices
    ) {

      if (device.id.trim() === '') {
        throw new Error(
          'Device id must not be empty.',
        );
      }

      if (device.type.trim() === '') {
        throw new Error(
          'Device type must not be empty.',
        );
      }

      if (device.host.trim() === '') {
        throw new Error(
          'Device host must not be empty.',
        );
      }

      if (
        device.port < 1
        || device.port > 65535
      ) {
        throw new Error(
          `Invalid TCP port: ${device.port}`,
        );
      }

      if (
        device.unitId < 1
        || device.unitId > 247
      ) {
        throw new Error(
          `Invalid Modbus unit id: ${device.unitId}`,
        );
      }

    }

    return configuration;

  }

}