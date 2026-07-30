import {
  SunSpecProperty,
} from '../SunSpecProperty.js';

import type {
  SunSpecPropertyReader,
} from './SunSpecPropertyReader.js';

/**
 * Provides convenient access to SunSpec nameplate properties.
 *
 * SunSpec Model ID: 120
 */
export class NameplateApi {

  public constructor(
    private readonly reader:
      SunSpecPropertyReader,
  ) {
  }

  /**
   * Reads the maximum active power rating.
   */
  public async maximumPower():
    Promise<number> {

    return this.reader.read(
      SunSpecProperty.Nameplate.MaximumPower,
    );

  }

  /**
   * Reads the maximum current rating.
   */
  public async maximumCurrent():
    Promise<number> {

    return this.reader.read(
      SunSpecProperty.Nameplate.MaximumCurrent,
    );

  }

  /**
   * Reads the maximum voltage rating.
   */
  public async maximumVoltage():
    Promise<number> {

    return this.reader.read(
      SunSpecProperty.Nameplate.MaximumVoltage,
    );

  }

}