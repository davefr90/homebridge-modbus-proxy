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
    Promise<number> {

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
   * Reads all currently exposed inverter properties.
   */
  public async snapshot():
    Promise<InverterSnapshot> {

    const [
      acCurrent,
      acCurrentA,
      acCurrentB,
      acCurrentC,
      acVoltageAB,
      acVoltageBC,
      acVoltageCA,
      acVoltageAN,
      acVoltageBN,
      acVoltageCN,
      acPower,
      frequency,
      apparentPower,
      reactivePower,
      powerFactor,
      dcCurrent,
      dcVoltage,
      dcPower,
      temperature,
      status,
    ] = await Promise.all([
      this.acCurrent(),
      this.acCurrentA(),
      this.acCurrentB(),
      this.acCurrentC(),
      this.acVoltageAB(),
      this.acVoltageBC(),
      this.acVoltageCA(),
      this.acVoltageAN(),
      this.acVoltageBN(),
      this.acVoltageCN(),
      this.acPower(),
      this.frequency(),
      this.apparentPower(),
      this.reactivePower(),
      this.powerFactor(),
      this.dcCurrent(),
      this.dcVoltage(),
      this.dcPower(),
      this.temperature(),
      this.status(),
    ]);

    return {
      acCurrent,
      acCurrentA,
      acCurrentB,
      acCurrentC,
      acVoltageAB,
      acVoltageBC,
      acVoltageCA,
      acVoltageAN,
      acVoltageBN,
      acVoltageCN,
      acPower,
      frequency,
      apparentPower,
      reactivePower,
      powerFactor,
      dcCurrent,
      dcVoltage,
      dcPower,
      temperature,
      status,
    };

  }

}