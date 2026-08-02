import {
  SunSpecProperty,
} from '../SunSpecProperty.js';

import type {
  InverterSnapshot,
} from '../models/snapshots/InverterSnapshot.js';

import {
  PropertyApi,
} from './PropertyApi.js';

import type {
  SunSpecPropertyReader,
} from './SunSpecPropertyReader.js';

/**
 * Inverter properties included in one coherent optimized
 * multi-property snapshot read.
 */
const INVERTER_SNAPSHOT_PROPERTIES = [
  SunSpecProperty.Inverter.AcCurrent,
  SunSpecProperty.Inverter.AcCurrentA,
  SunSpecProperty.Inverter.AcCurrentB,
  SunSpecProperty.Inverter.AcCurrentC,
  SunSpecProperty.Inverter.AcVoltageAB,
  SunSpecProperty.Inverter.AcVoltageBC,
  SunSpecProperty.Inverter.AcVoltageCA,
  SunSpecProperty.Inverter.AcVoltageAN,
  SunSpecProperty.Inverter.AcVoltageBN,
  SunSpecProperty.Inverter.AcVoltageCN,
  SunSpecProperty.Inverter.AcPower,
  SunSpecProperty.Inverter.Frequency,
  SunSpecProperty.Inverter.ApparentPower,
  SunSpecProperty.Inverter.ReactivePower,
  SunSpecProperty.Inverter.PowerFactor,
  SunSpecProperty.Inverter.DcCurrent,
  SunSpecProperty.Inverter.DcVoltage,
  SunSpecProperty.Inverter.DcPower,
  SunSpecProperty.Inverter.Temperature,
  SunSpecProperty.Inverter.Status,
] as const;

/**
 * Provides convenient access to SunSpec inverter properties.
 *
 * Currently backed by SunSpec Inverter Model 103.
 */
export class InverterApi
  extends PropertyApi {

  /**
   * Creates a new Inverter Model API.
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
   * Reads total AC current.
   */
  public async acCurrent():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcCurrent,
    );

  }

  /**
   * Reads phase A AC current.
   */
  public async acCurrentA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcCurrentA,
    );

  }

  /**
   * Reads phase B AC current.
   */
  public async acCurrentB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcCurrentB,
    );

  }

  /**
   * Reads phase C AC current.
   */
  public async acCurrentC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcCurrentC,
    );

  }

  /**
   * Reads line-to-line voltage AB.
   */
  public async acVoltageAB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageAB,
    );

  }

  /**
   * Reads line-to-line voltage BC.
   */
  public async acVoltageBC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageBC,
    );

  }

  /**
   * Reads line-to-line voltage CA.
   */
  public async acVoltageCA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageCA,
    );

  }

  /**
   * Reads phase A to neutral voltage.
   */
  public async acVoltageAN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageAN,
    );

  }

  /**
   * Reads phase B to neutral voltage.
   */
  public async acVoltageBN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageBN,
    );

  }

  /**
   * Reads phase C to neutral voltage.
   */
  public async acVoltageCN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcVoltageCN,
    );

  }

  /**
   * Reads active AC power.
   */
  public async acPower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.AcPower,
    );

  }

  /**
   * Reads AC frequency.
   */
  public async frequency():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.Frequency,
    );

  }

  /**
   * Reads apparent AC power.
   */
  public async apparentPower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.ApparentPower,
    );

  }

  /**
   * Reads reactive AC power.
   */
  public async reactivePower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.ReactivePower,
    );

  }

  /**
   * Reads AC power factor.
   */
  public async powerFactor():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.PowerFactor,
    );

  }

  /**
   * Reads DC current.
   */
  public async dcCurrent():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.DcCurrent,
    );

  }

  /**
   * Reads DC voltage.
   */
  public async dcVoltage():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.DcVoltage,
    );

  }

  /**
   * Reads DC power.
   */
  public async dcPower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.DcPower,
    );

  }

  /**
   * Reads inverter temperature.
   */
  public async temperature():
    Promise<number | undefined> {

    return this.read(
      SunSpecProperty.Inverter.Temperature,
    );

  }

  /**
   * Reads inverter operating status.
   */
  public async status():
    Promise<number> {

    return this.read(
      SunSpecProperty.Inverter.Status,
    );

  }

  /**
   * Reads all currently exposed inverter properties from one
   * coherent optimized Modbus block snapshot.
   */
  public async snapshot():
    Promise<InverterSnapshot> {

    const values =
      await this.readMany(
        INVERTER_SNAPSHOT_PROPERTIES,
      );

    return {
      acCurrent:
        values[SunSpecProperty.Inverter.AcCurrent],

      acCurrentA:
        values[SunSpecProperty.Inverter.AcCurrentA],

      acCurrentB:
        values[SunSpecProperty.Inverter.AcCurrentB],

      acCurrentC:
        values[SunSpecProperty.Inverter.AcCurrentC],

      acVoltageAB:
        values[SunSpecProperty.Inverter.AcVoltageAB],

      acVoltageBC:
        values[SunSpecProperty.Inverter.AcVoltageBC],

      acVoltageCA:
        values[SunSpecProperty.Inverter.AcVoltageCA],

      acVoltageAN:
        values[SunSpecProperty.Inverter.AcVoltageAN],

      acVoltageBN:
        values[SunSpecProperty.Inverter.AcVoltageBN],

      acVoltageCN:
        values[SunSpecProperty.Inverter.AcVoltageCN],

      acPower:
        values[SunSpecProperty.Inverter.AcPower],

      frequency:
        values[SunSpecProperty.Inverter.Frequency],

      apparentPower:
        values[SunSpecProperty.Inverter.ApparentPower],

      reactivePower:
        values[SunSpecProperty.Inverter.ReactivePower],

      powerFactor:
        values[SunSpecProperty.Inverter.PowerFactor],

      dcCurrent:
        values[SunSpecProperty.Inverter.DcCurrent],

      dcVoltage:
        values[SunSpecProperty.Inverter.DcVoltage],

      dcPower:
        values[SunSpecProperty.Inverter.DcPower],

      temperature:
        values[SunSpecProperty.Inverter.Temperature],

      status:
        values[SunSpecProperty.Inverter.Status],
    };

  }

}
