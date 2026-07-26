import type { ModbusClient } from '../client/ModbusClient.js';
import { ConfigurationLoader } from '../config/ConfigurationLoader.js';
import type { ProxyConfiguration } from '../config/ProxyConfiguration.js';
import { DeviceCatalog } from '../device/DeviceCatalog.js';
import { DeviceDefinitionProvider } from '../device/DeviceDefinitionProvider.js';
import { DeviceRegistry } from '../device/DeviceRegistry.js';
import { DeviceFactory } from '../model/DeviceFactory.js';

/**
 * Central runtime for the Modbus proxy.
 */
export class ProxyRuntime {

  public readonly catalog: DeviceCatalog;

  public readonly registry: DeviceRegistry;

  public readonly factory: DeviceFactory;

  public readonly definitions: DeviceDefinitionProvider;

  private readonly loader =
    new ConfigurationLoader();

  public constructor(
    client: ModbusClient,
  ) {

    this.factory =
      new DeviceFactory(
        client,
      );

    this.catalog =
      new DeviceCatalog();

    this.registry =
      new DeviceRegistry(
        this.factory,
      );

    this.definitions =
      new DeviceDefinitionProvider();

  }

  /**
   * Loads a proxy configuration.
   */
  public load(
    configuration: ProxyConfiguration,
  ): void {

    const validated =
      this.loader.load(
        configuration,
      );

    for (
      const device of validated.devices
    ) {

      const definition =
        this.definitions.get(
          device.type,
        );

      this.catalog.register(
        device.id,
        definition,
      );

    }

  }

  /**
   * Creates runtime devices.
   */
  public initialize(): void {

    for (
      const id of this.catalog.ids()
    ) {

      this.registry.register(
        id,
        this.catalog.get(
          id,
        ),
      );

    }

  }

}