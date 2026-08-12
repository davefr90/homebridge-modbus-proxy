/**
 * User-facing Modbus TCP proxy configuration stored inside
 * the Homebridge platform configuration.
 */
export interface ModbusTcpProxyPlatformConfiguration {

  readonly targetHost: string;

  readonly targetPort?: number;

  readonly listenHost?: string;

  readonly listenPort?: number;

}

/**
 * Fully validated Modbus TCP proxy configuration used by the
 * Homebridge runtime.
 */
export interface NormalizedModbusTcpProxyPlatformConfiguration {

  readonly targetHost: string;

  readonly targetPort: number;

  readonly listenHost: string;

  readonly listenPort: number;

}
