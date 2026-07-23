import type {
  API,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge';

/**
 * Main Homebridge platform class.
 *
 * This plugin does not create HomeKit accessories.
 * Homebridge is currently only used to start and stop the Modbus proxy.
 */
export class ModbusProxyPlatform implements DynamicPlatformPlugin {
  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Initializing Modbus Proxy platform');

    this.api.on('didFinishLaunching', () => {
      this.log.info('Modbus Proxy platform started');
    });

    this.api.on('shutdown', () => {
      this.log.info('Modbus Proxy platform stopped');
    });
  }

  /**
   * Required by DynamicPlatformPlugin.
   *
   * Older cached accessories are removed because this plugin does not expose
   * HomeKit accessories.
   */
  configureAccessory(accessory: PlatformAccessory): void {
    this.log.warn(
      'Removing obsolete cached accessory:',
      accessory.displayName,
    );

    this.api.unregisterPlatformAccessories(
      'homebridge-modbus-proxy',
      'ModbusProxy',
      [accessory],
    );
  }
}
