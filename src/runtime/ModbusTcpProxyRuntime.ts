import type {
  NormalizedModbusTcpProxyPlatformConfiguration,
} from '../config/ModbusTcpProxyPlatformConfiguration.js';

import type {
  Logger,
} from '../logging/Logger.js';

import {
  ConnectionManager,
} from '../proxy/ConnectionManager.js';

import type {
  ManagedDevice,
} from '../proxy/ManagedDevice.js';

import {
  ManagedDeviceRuntime,
} from '../proxy/ManagedDeviceRuntime.js';

import {
  ProxyServer,
} from '../proxy/ProxyServer.js';

/**
 * Connection-manager surface used by the proxy runtime.
 */
export interface ModbusTcpProxyRuntimeConnection {

  connect(): Promise<void>;

  disconnect(): void;

  isConnected(): boolean;

}

/**
 * TCP-server surface used by the proxy runtime.
 */
export interface ModbusTcpProxyRuntimeServer {

  readonly isRunning: boolean;

  readonly port: number;

  readonly sessionCount: number;

  start(
    port: number,
    host: string,
  ): Promise<void>;

  stop(): Promise<void>;

}

/**
 * Read-only status of the Homebridge-owned Modbus TCP proxy.
 */
export interface ModbusTcpProxyRuntimeStatus {

  readonly running: boolean;

  readonly targetConnected: boolean;

  readonly listeningPort: number | undefined;

  readonly clientCount: number;

}

export type ModbusTcpProxyRuntimeComponentsFactory =
  (
    device: ManagedDevice,
    logger: Logger,
  ) => {
    readonly connection:
      ModbusTcpProxyRuntimeConnection;

    readonly server:
      ModbusTcpProxyRuntimeServer;
  };

/**
 * Owns one shared upstream Modbus connection and a TCP
 * listener for all downstream proxy clients.
 */
export class ModbusTcpProxyRuntime {

  private readonly connection:
    ModbusTcpProxyRuntimeConnection;

  private readonly server:
    ModbusTcpProxyRuntimeServer;

  private started =
    false;

  public constructor(

    private readonly configuration:
      NormalizedModbusTcpProxyPlatformConfiguration,

    private readonly logger:
      Logger,

    componentsFactory:
      ModbusTcpProxyRuntimeComponentsFactory =
    (
      device,
      runtimeLogger,
    ) => {
      const connection =
        new ConnectionManager(
          new ManagedDeviceRuntime(
            device,
          ),
          undefined,
          runtimeLogger,
        );

      return {
        connection,
        server:
          new ProxyServer(
            connection,
          ),
      };
    },

  ) {

    const device: ManagedDevice = {
      id: 'homebridge-modbus-proxy-target',
      name: 'Modbus TCP Proxy Target',
      host: configuration.targetHost,
      port: configuration.targetPort,
      unitId: 1,
    };

    const components =
      componentsFactory(
        device,
        logger,
      );

    this.connection =
      components.connection;

    this.server =
      components.server;

  }

  /**
   * Connects the shared upstream client before exposing the
   * downstream TCP listener.
   */
  public async start():
    Promise<void> {

    if (this.started) {
      return;
    }

    this.logger.info(
      'Starting Modbus TCP proxy for '
      + `${this.configuration.targetHost}:${this.configuration.targetPort}.`,
    );

    try {
      await this.connection.connect();

      await this.server.start(
        this.configuration.listenPort,
        this.configuration.listenHost,
      );

      this.started =
        true;

      this.logger.info(
        'Modbus TCP proxy listening on '
        + `${this.configuration.listenHost}:${this.server.port} `
        + `and forwarding to ${this.configuration.targetHost}:${this.configuration.targetPort}.`,
      );
    } catch (error) {
      await this.stopAfterStartFailure();

      const normalizedError =
        ModbusTcpProxyRuntime.normalizeError(
          error,
        );

      this.logger.error(
        'Unable to start Modbus TCP proxy.',
        normalizedError,
      );

      throw normalizedError;
    }

  }

  /**
   * Stops accepting clients before closing the upstream
   * Modbus connection.
   */
  public async stop():
    Promise<void> {

    if (
      !this.started
      && !this.server.isRunning
      && !this.connection.isConnected()
    ) {
      return;
    }

    try {
      await this.server.stop();
    } finally {
      this.connection.disconnect();
      this.started =
        false;
    }

    this.logger.info(
      'Modbus TCP proxy stopped and disconnected.',
    );

  }

  public status():
    ModbusTcpProxyRuntimeStatus {

    return {
      running:
        this.server.isRunning,

      targetConnected:
        this.connection.isConnected(),

      listeningPort:
        this.server.isRunning
          ? this.server.port
          : undefined,

      clientCount:
        this.server.sessionCount,
    };

  }

  private async stopAfterStartFailure():
    Promise<void> {

    try {
      await this.server.stop();
    } catch {
      /* Preserve the original startup error. */
    }

    this.connection.disconnect();
    this.started =
      false;

  }

  private static normalizeError(
    error: unknown,
  ): Error {

    return error instanceof Error
      ? error
      : new Error(
        String(error),
      );

  }

}
