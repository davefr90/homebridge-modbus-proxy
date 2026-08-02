import type {
  BatterySnapshot,
} from '../models/snapshots/BatterySnapshot.js';

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
 * SolarEdge battery properties included in one optimized
 * multi-property snapshot read.
 */
const BATTERY_SNAPSHOT_PROPERTIES = [
  SunSpecProperty.Battery.Manufacturer,
  SunSpecProperty.Battery.Model,
  SunSpecProperty.Battery.FirmwareVersion,
  SunSpecProperty.Battery.SerialNumber,
  SunSpecProperty.Battery.DeviceId,
  SunSpecProperty.Battery.RatedEnergy,
  SunSpecProperty.Battery.MaximumChargeContinuousPower,
  SunSpecProperty.Battery.MaximumDischargeContinuousPower,
  SunSpecProperty.Battery.MaximumChargePeakPower,
  SunSpecProperty.Battery.MaximumDischargePeakPower,
  SunSpecProperty.Battery.AverageTemperature,
  SunSpecProperty.Battery.MaximumTemperature,
  SunSpecProperty.Battery.Voltage,
  SunSpecProperty.Battery.Current,
  SunSpecProperty.Battery.Power,
  SunSpecProperty.Battery.MaximumEnergy,
  SunSpecProperty.Battery.AvailableEnergy,
  SunSpecProperty.Battery.StateOfHealth,
  SunSpecProperty.Battery.StateOfEnergy,
  SunSpecProperty.Battery.Status,
  SunSpecProperty.Battery.StatusInternal,
] as const;

/**
 * Provides access to one inverter's proprietary SolarEdge
 * Battery 1 status and information block.
 */
export class BatteryApi
  extends PropertyApi {

  public constructor(
    reader: SunSpecPropertyReader,
  ) {

    super(
      reader,
    );

  }

  public manufacturer():
    Promise<string> {

    return this.read(
      SunSpecProperty.Battery.Manufacturer,
    );

  }

  public model():
    Promise<string> {

    return this.read(
      SunSpecProperty.Battery.Model,
    );

  }

  public firmwareVersion():
    Promise<string> {

    return this.read(
      SunSpecProperty.Battery.FirmwareVersion,
    );

  }

  public serialNumber():
    Promise<string> {

    return this.read(
      SunSpecProperty.Battery.SerialNumber,
    );

  }

  public deviceId():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.DeviceId,
    );

  }

  public ratedEnergy():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.RatedEnergy,
    );

  }

  public maximumChargeContinuousPower():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumChargeContinuousPower,
    );

  }

  public maximumDischargeContinuousPower():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumDischargeContinuousPower,
    );

  }

  public maximumChargePeakPower():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumChargePeakPower,
    );

  }

  public maximumDischargePeakPower():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumDischargePeakPower,
    );

  }

  public averageTemperature():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.AverageTemperature,
    );

  }

  public maximumTemperature():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumTemperature,
    );

  }

  public voltage():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.Voltage,
    );

  }

  public current():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.Current,
    );

  }

  public power():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.Power,
    );

  }

  public maximumEnergy():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.MaximumEnergy,
    );

  }

  public availableEnergy():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.AvailableEnergy,
    );

  }

  public stateOfHealth():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.StateOfHealth,
    );

  }

  public stateOfEnergy():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.StateOfEnergy,
    );

  }

  public status():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.Status,
    );

  }

  public statusInternal():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Battery.StatusInternal,
    );

  }

  /**
   * Reads all exposed SolarEdge battery properties using
   * optimized Modbus block requests.
   */
  public async snapshot():
    Promise<BatterySnapshot> {

    const values =
      await this.readMany(
        BATTERY_SNAPSHOT_PROPERTIES,
      );

    const power =
      values[SunSpecProperty.Battery.Power];

    return {
      manufacturer:
        values[SunSpecProperty.Battery.Manufacturer],

      model:
        values[SunSpecProperty.Battery.Model],

      firmwareVersion:
        values[SunSpecProperty.Battery.FirmwareVersion],

      serialNumber:
        values[SunSpecProperty.Battery.SerialNumber],

      deviceId:
        values[SunSpecProperty.Battery.DeviceId],

      ratedEnergy:
        values[SunSpecProperty.Battery.RatedEnergy],

      maximumChargeContinuousPower:
        values[SunSpecProperty.Battery.MaximumChargeContinuousPower],

      maximumDischargeContinuousPower:
        values[SunSpecProperty.Battery.MaximumDischargeContinuousPower],

      maximumChargePeakPower:
        values[SunSpecProperty.Battery.MaximumChargePeakPower],

      maximumDischargePeakPower:
        values[SunSpecProperty.Battery.MaximumDischargePeakPower],

      averageTemperature:
        values[SunSpecProperty.Battery.AverageTemperature],

      maximumTemperature:
        values[SunSpecProperty.Battery.MaximumTemperature],

      voltage:
        values[SunSpecProperty.Battery.Voltage],

      current:
        values[SunSpecProperty.Battery.Current],

      power,

      chargePower:
        power === undefined
          ? undefined
          : Math.max(
            power,
            0,
          ),

      dischargePower:
        power === undefined
          ? undefined
          : Math.max(
            -power,
            0,
          ),

      maximumEnergy:
        values[SunSpecProperty.Battery.MaximumEnergy],

      availableEnergy:
        values[SunSpecProperty.Battery.AvailableEnergy],

      stateOfHealth:
        values[SunSpecProperty.Battery.StateOfHealth],

      stateOfEnergy:
        values[SunSpecProperty.Battery.StateOfEnergy],

      status:
        values[SunSpecProperty.Battery.Status],

      statusInternal:
        values[SunSpecProperty.Battery.StatusInternal],
    };

  }

}
