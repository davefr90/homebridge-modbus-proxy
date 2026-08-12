import type {
  API,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge';

import type {
  NormalizedModbusTcpProxyPlatformConfiguration,
} from './config/ModbusTcpProxyPlatformConfiguration.js';

import {
  ModbusTcpProxyPlatformConfigurationLoader,
} from './config/ModbusTcpProxyPlatformConfigurationLoader.js';

import type {
  NormalizedSolarEdgePlantPlatformConfiguration,
} from './config/SolarEdgePlantPlatformConfiguration.js';

import {
  SolarEdgePlantPlatformConfigurationLoader,
} from './config/SolarEdgePlantPlatformConfigurationLoader.js';

import type {
  Logger,
} from './logging/Logger.js';

import {
  ModbusTcpProxyRuntime,
} from './runtime/ModbusTcpProxyRuntime.js';

import type {
  ModbusTcpProxyRuntimeStatus,
} from './runtime/ModbusTcpProxyRuntime.js';

import {
  SolarEdgePlantRuntime,
} from './runtime/SolarEdgePlantRuntime.js';

import type {
  SolarEdgePlantSnapshot,
} from './sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import type {
  SolarEdgePlantMonitorStatus,
} from './sunspec/solaredge/SolarEdgePlantMonitorStatus.js';

import {
  PLATFORM_NAME,
  PLUGIN_NAME,
} from './settings.js';

/**
 * Homebridge configuration owned by this platform.
 */
export interface ModbusProxyPlatformConfiguration
extends PlatformConfig {

  readonly modbusProxy?: unknown;

  readonly solarEdge?: unknown;

}

/**
 * Runtime surface managed by the platform lifecycle.
 */
export interface ModbusProxyPlantRuntime {

  start(): Promise<void>;

  stop(): Promise<void>;

  latest(): SolarEdgePlantSnapshot | undefined;

  status(): SolarEdgePlantMonitorStatus;

}

export type ModbusProxyPlantRuntimeFactory =
  (
    configuration:
      NormalizedSolarEdgePlantPlatformConfiguration,
    logger: Logger,
  ) => ModbusProxyPlantRuntime;

/**
 * Modbus TCP proxy runtime surface managed by the platform.
 */
export interface ModbusProxyServerRuntime {

  start(): Promise<void>;

  stop(): Promise<void>;

  status(): ModbusTcpProxyRuntimeStatus;

}

export type ModbusProxyServerRuntimeFactory =
  (
    configuration:
      NormalizedModbusTcpProxyPlatformConfiguration,
    logger: Logger,
  ) => ModbusProxyServerRuntime;

/**
 * Main Homebridge platform class.
 *
 * The platform owns long-running services and their cached
 * state. It currently does not expose HomeKit accessories.
 */
export class ModbusProxyPlatform
implements DynamicPlatformPlugin {

  private readonly plantRuntime:
    ModbusProxyPlantRuntime
    | undefined;

  private readonly proxyRuntime:
    ModbusProxyServerRuntime
    | undefined;

  private readonly solarEdgeConfigured:
    boolean;

  private readonly modbusProxyConfigured:
    boolean;

  public constructor(

    public readonly log: Logging,

    public readonly config:
      ModbusProxyPlatformConfiguration,

    public readonly api: API,

    plantRuntimeFactory:
      ModbusProxyPlantRuntimeFactory =
    (
      configuration,
      logger,
    ) =>
      new SolarEdgePlantRuntime(
        configuration,
        logger,
      ),

    proxyRuntimeFactory:
      ModbusProxyServerRuntimeFactory =
    (
      configuration,
      logger,
    ) =>
      new ModbusTcpProxyRuntime(
        configuration,
        logger,
      ),

  ) {

    this.log.debug(
      'Initializing Modbus Proxy platform.',
    );

    this.solarEdgeConfigured =
      config.solarEdge !== undefined;

    this.modbusProxyConfigured =
      config.modbusProxy !== undefined;

    this.plantRuntime =
      this.createPlantRuntime(
        plantRuntimeFactory,
      );

    this.proxyRuntime =
      this.createProxyRuntime(
        proxyRuntimeFactory,
      );

    this.api.on(
      'didFinishLaunching',
      () => {
        void this.start();
      },
    );

    this.api.on(
      'shutdown',
      () => {
        void this.shutdown();
      },
    );

  }

  /**
   * Starts configured long-running services after Homebridge
   * has completed its launch sequence.
   */
  public async start():
    Promise<void> {

    this.log.info(
      'Modbus Proxy platform started.',
    );

    if (this.proxyRuntime === undefined) {
      if (!this.modbusProxyConfigured) {
        this.log.info(
          'Modbus TCP proxy server is not configured.',
        );
      }
    } else {
      try {
        await this.proxyRuntime.start();
      } catch (error) {
        const normalizedError =
          ModbusProxyPlatform.normalizeError(
            error,
          );

        this.log.error(
          `Modbus TCP proxy server could not be started: ${normalizedError.message}`,
        );
      }
    }

    if (this.plantRuntime === undefined) {
      if (!this.solarEdgeConfigured) {
        this.log.info(
          'SolarEdge plant monitoring is not configured.',
        );
      }
    } else {
      try {
        await this.plantRuntime.start();
      } catch (error) {
        const normalizedError =
          ModbusProxyPlatform.normalizeError(
            error,
          );

        this.log.error(
          `SolarEdge plant monitoring could not be started: ${normalizedError.message}`,
        );
      }
    }

  }

  /**
   * Stops all owned services during Homebridge shutdown.
   */
  public async shutdown():
    Promise<void> {

    try {
      await this.plantRuntime
        ?.stop();
    } catch (error) {
      const normalizedError =
        ModbusProxyPlatform.normalizeError(
          error,
        );

      this.log.error(
        `SolarEdge plant monitoring could not be stopped cleanly: ${normalizedError.message}`,
      );
    }

    try {
      await this.proxyRuntime
        ?.stop();
    } catch (error) {
      const normalizedError =
        ModbusProxyPlatform.normalizeError(
          error,
        );

      this.log.error(
        `Modbus TCP proxy server could not be stopped cleanly: ${normalizedError.message}`,
      );
    }

    this.log.info(
      'Modbus Proxy platform stopped.',
    );

  }

  /**
   * Returns the latest cached plant snapshot without reading
   * the Modbus device.
   */
  public latestPlantSnapshot():
    SolarEdgePlantSnapshot | undefined {

    return this.plantRuntime
      ?.latest();

  }

  public plantMonitorStatus():
    SolarEdgePlantMonitorStatus | undefined {

    return this.plantRuntime
      ?.status();

  }

  public modbusProxyStatus():
    ModbusTcpProxyRuntimeStatus | undefined {

    return this.proxyRuntime
      ?.status();

  }

  /**
   * Older cached accessories are removed because this plugin
   * currently exposes no HomeKit accessories.
   */
  public configureAccessory(
    accessory: PlatformAccessory,
  ): void {

    this.log.warn(
      'Removing obsolete cached accessory:',
      accessory.displayName,
    );

    this.api.unregisterPlatformAccessories(
      PLUGIN_NAME,
      PLATFORM_NAME,
      [
        accessory,
      ],
    );

  }

  private createPlantRuntime(
    factory: ModbusProxyPlantRuntimeFactory,
  ): ModbusProxyPlantRuntime | undefined {

    try {

      const configuration =
        new SolarEdgePlantPlatformConfigurationLoader()
          .load(
            this.config.solarEdge,
          );

      if (configuration === undefined) {
        return undefined;
      }

      return factory(
        configuration,
        this.createRuntimeLogger(),
      );

    } catch (error) {

      const normalizedError =
        ModbusProxyPlatform.normalizeError(
          error,
        );

      this.log.error(
        `Invalid SolarEdge plant configuration: ${normalizedError.message}`,
      );

      return undefined;

    }

  }

  private createProxyRuntime(
    factory: ModbusProxyServerRuntimeFactory,
  ): ModbusProxyServerRuntime | undefined {

    try {

      const configuration =
        new ModbusTcpProxyPlatformConfigurationLoader()
          .load(
            this.config.modbusProxy,
          );

      if (configuration === undefined) {
        return undefined;
      }

      return factory(
        configuration,
        this.createRuntimeLogger(),
      );

    } catch (error) {

      const normalizedError =
        ModbusProxyPlatform.normalizeError(
          error,
        );

      this.log.error(
        `Invalid Modbus TCP proxy configuration: ${normalizedError.message}`,
      );

      return undefined;

    }

  }

  private createRuntimeLogger():
    Logger {

    return {
      debug:
        (message) => {
          this.log.debug(
            message,
          );
        },

      info:
        (message) => {
          this.log.info(
            message,
          );
        },

      warn:
        (message) => {
          this.log.warn(
            message,
          );
        },

      error:
        (
          message,
          error,
        ) => {
          this.log.error(
            error === undefined
              ? message
              : `${message} ${error.message}`,
          );
        },
    };

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
