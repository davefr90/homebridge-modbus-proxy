import type {
  NormalizedModbusTcpProxyPlatformConfiguration,
} from './ModbusTcpProxyPlatformConfiguration.js';

/**
 * Validates and normalizes the optional Modbus TCP proxy
 * section of the Homebridge platform configuration.
 */
export class ModbusTcpProxyPlatformConfigurationLoader {

  public load(
    value: unknown,
  ): NormalizedModbusTcpProxyPlatformConfiguration | undefined {

    if (value === undefined) {
      return undefined;
    }

    if (!ModbusTcpProxyPlatformConfigurationLoader.isRecord(value)) {
      throw new Error(
        'Modbus TCP proxy configuration must be an object.',
      );
    }

    const targetHost =
      ModbusTcpProxyPlatformConfigurationLoader
        .readHost(
          'Modbus TCP proxy target host',
          value.targetHost,
        );

    const targetPort =
      ModbusTcpProxyPlatformConfigurationLoader
        .readPort(
          'Modbus TCP proxy target port',
          value.targetPort,
          502,
        );

    const listenHost =
      ModbusTcpProxyPlatformConfigurationLoader
        .readHost(
          'Modbus TCP proxy listen host',
          value.listenHost
          ?? '0.0.0.0',
        );

    const listenPort =
      ModbusTcpProxyPlatformConfigurationLoader
        .readPort(
          'Modbus TCP proxy listen port',
          value.listenPort,
          1502,
        );

    return Object.freeze({
      targetHost,
      targetPort,
      listenHost,
      listenPort,
    });

  }

  private static readHost(
    name: string,
    value: unknown,
  ): string {

    if (typeof value !== 'string') {
      throw new Error(
        `${name} must be a string.`,
      );
    }

    const host =
      value.trim();

    if (host.length === 0) {
      throw new Error(
        `${name} must not be empty.`,
      );
    }

    return host;

  }

  private static readPort(
    name: string,
    value: unknown,
    defaultValue: number,
  ): number {

    const port =
      value
      ?? defaultValue;

    if (
      !Number.isInteger(port)
      || (port as number) < 1
      || (port as number) > 65535
    ) {
      throw new Error(
        `${name} must be an integer between 1 and 65535.`,
      );
    }

    return port as number;

  }

  private static isRecord(
    value: unknown,
  ): value is Record<string, unknown> {

    return typeof value === 'object'
      && value !== null
      && !Array.isArray(value);

  }

}
