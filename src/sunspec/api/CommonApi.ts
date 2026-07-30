import {
  SunSpecProperty,
} from '../SunSpecProperty.js';

import {
  PropertyApi,
} from './PropertyApi.js';

import type {
  SunSpecPropertyReader,
} from './SunSpecPropertyReader.js';

/**
 * Provides convenient access to SunSpec Common Model
 * properties.
 *
 * SunSpec Model ID: 1
 */
export class CommonApi
  extends PropertyApi {

  /**
   * Creates a new Common Model API.
   *
   * @param reader Logical SunSpec property reader.
   */
  public constructor(
    reader: SunSpecPropertyReader,
  ) {

    super(
      reader,
    );

  }

  /**
   * Reads the manufacturer name.
   */
  public async manufacturer():
    Promise<string> {

    return this.read(
      SunSpecProperty.Common.Manufacturer,
    );

  }

  /**
   * Reads the device model name.
   */
  public async modelName():
    Promise<string> {

    return this.read(
      SunSpecProperty.Common.Model,
    );

  }

  /**
   * Reads the manufacturer-specific options string.
   */
  public async options():
    Promise<string> {

    return this.read(
      SunSpecProperty.Common.Options,
    );

  }

  /**
   * Reads the device firmware or software version.
   */
  public async version():
    Promise<string> {

    return this.read(
      SunSpecProperty.Common.Version,
    );

  }

  /**
   * Reads the device serial number.
   */
  public async serialNumber():
    Promise<string> {

    return this.read(
      SunSpecProperty.Common.SerialNumber,
    );

  }

  /**
   * Reads the Modbus device address.
   */
  public async deviceAddress():
    Promise<number> {

    return this.read(
      SunSpecProperty.Common.DeviceAddress,
    );

  }

}