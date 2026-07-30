import {
  SunSpecProperty,
} from '../SunSpecProperty.js';

import type {
  SunSpecPropertyReader,
} from './SunSpecPropertyReader.js';

/**
 * Provides convenient access to SunSpec Common Model
 * properties.
 *
 * SunSpec Model ID: 1
 */
export class CommonApi {

  public constructor(
    private readonly reader:
      SunSpecPropertyReader,
  ) {
  }

  /**
   * Reads the manufacturer name.
   */
  public async manufacturer():
    Promise<string> {

    return this.reader.read(
      SunSpecProperty.Common.Manufacturer,
    );

  }

  /**
   * Reads the device model name.
   */
  public async modelName():
    Promise<string> {

    return this.reader.read(
      SunSpecProperty.Common.Model,
    );

  }

  /**
   * Reads the manufacturer-specific options string.
   */
  public async options():
    Promise<string> {

    return this.reader.read(
      SunSpecProperty.Common.Options,
    );

  }

  /**
   * Reads the device firmware or software version.
   */
  public async version():
    Promise<string> {

    return this.reader.read(
      SunSpecProperty.Common.Version,
    );

  }

  /**
   * Reads the device serial number.
   */
  public async serialNumber():
    Promise<string> {

    return this.reader.read(
      SunSpecProperty.Common.SerialNumber,
    );

  }

  /**
   * Reads the Modbus device address.
   */
  public async deviceAddress():
    Promise<number> {

    return this.reader.read(
      SunSpecProperty.Common.DeviceAddress,
    );

  }

}