import { DeviceRegisterMap } from './DeviceRegisterMap.js';
import type { DeviceInfo } from './DeviceInfo.js';

/**
 * Describes a Modbus device.
 */
export class DeviceDefinition {

  public constructor(

    /**
     * Static device information.
     */
    public readonly info: DeviceInfo,

    /**
     * Register map describing the device.
     */
    public readonly registerMap: DeviceRegisterMap,

  ) {}

}