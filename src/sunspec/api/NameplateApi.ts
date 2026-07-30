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
 * Provides convenient access to SunSpec nameplate properties.
 *
 * SunSpec Model ID: 120
 */
export class NameplateApi
  extends PropertyApi {

  /**
   * Creates a new Nameplate Model API.
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
   * Reads the maximum active power rating.
   */
  public async maximumPower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Nameplate.MaximumPower,
    );

  }

  /**
   * Reads the maximum current rating.
   */
  public async maximumCurrent():
    Promise<number> {

    return this.read(
      SunSpecProperty.Nameplate.MaximumCurrent,
    );

  }

  /**
   * Reads the maximum voltage rating.
   */
  public async maximumVoltage():
    Promise<number> {

    return this.read(
      SunSpecProperty.Nameplate.MaximumVoltage,
    );

  }

}