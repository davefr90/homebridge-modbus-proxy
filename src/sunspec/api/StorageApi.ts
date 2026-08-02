import type {
  StorageSnapshot,
} from '../models/snapshots/StorageSnapshot.js';

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
 * Storage properties included in one coherent snapshot read.
 */
const STORAGE_SNAPSHOT_PROPERTIES = [
  SunSpecProperty.Storage.EnergyRating,
  SunSpecProperty.Storage.EnergyAvailable,
  SunSpecProperty.Storage.StateOfCharge,
  SunSpecProperty.Storage.StateOfHealth,
  SunSpecProperty.Storage.Status,
] as const;

/**
 * Provides convenient access to SunSpec storage properties.
 *
 * SunSpec Model ID: 713
 */
export class StorageApi
  extends PropertyApi {

  public constructor(
    reader: SunSpecPropertyReader,
  ) {

    super(
      reader,
    );

  }

  /**
   * Reads the rated storage energy in watt-hours.
   */
  public energyRating():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Storage.EnergyRating,
    );

  }

  /**
   * Reads the currently available storage energy in
   * watt-hours.
   */
  public energyAvailable():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Storage.EnergyAvailable,
    );

  }

  /**
   * Reads the state of charge in percent.
   */
  public stateOfCharge():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Storage.StateOfCharge,
    );

  }

  /**
   * Reads the state of health in percent.
   */
  public stateOfHealth():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Storage.StateOfHealth,
    );

  }

  /**
   * Reads the storage status enumeration.
   */
  public status():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Storage.Status,
    );

  }

  /**
   * Reads all exposed storage properties from one coherent
   * Modbus block snapshot.
   */
  public async snapshot():
    Promise<StorageSnapshot> {

    const values =
      await this.readMany(
        STORAGE_SNAPSHOT_PROPERTIES,
      );

    return {
      energyRating:
        values[SunSpecProperty.Storage.EnergyRating],

      energyAvailable:
        values[SunSpecProperty.Storage.EnergyAvailable],

      stateOfCharge:
        values[SunSpecProperty.Storage.StateOfCharge],

      stateOfHealth:
        values[SunSpecProperty.Storage.StateOfHealth],

      status:
        values[SunSpecProperty.Storage.Status],
    };

  }

}
