import type {
  MeterSnapshot,
} from '../models/snapshots/MeterSnapshot.js';

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
 * Meter properties included in one coherent snapshot read.
 */
const METER_SNAPSHOT_PROPERTIES = [
  SunSpecProperty.Meter.Current,
  SunSpecProperty.Meter.CurrentA,
  SunSpecProperty.Meter.CurrentB,
  SunSpecProperty.Meter.CurrentC,
  SunSpecProperty.Meter.VoltageLineNeutral,
  SunSpecProperty.Meter.VoltageAN,
  SunSpecProperty.Meter.VoltageBN,
  SunSpecProperty.Meter.VoltageCN,
  SunSpecProperty.Meter.VoltageLineLine,
  SunSpecProperty.Meter.VoltageAB,
  SunSpecProperty.Meter.VoltageBC,
  SunSpecProperty.Meter.VoltageCA,
  SunSpecProperty.Meter.Frequency,
  SunSpecProperty.Meter.ActivePower,
  SunSpecProperty.Meter.ActivePowerA,
  SunSpecProperty.Meter.ActivePowerB,
  SunSpecProperty.Meter.ActivePowerC,
  SunSpecProperty.Meter.ApparentPower,
  SunSpecProperty.Meter.ApparentPowerA,
  SunSpecProperty.Meter.ApparentPowerB,
  SunSpecProperty.Meter.ApparentPowerC,
  SunSpecProperty.Meter.ReactivePower,
  SunSpecProperty.Meter.ReactivePowerA,
  SunSpecProperty.Meter.ReactivePowerB,
  SunSpecProperty.Meter.ReactivePowerC,
  SunSpecProperty.Meter.PowerFactor,
  SunSpecProperty.Meter.PowerFactorA,
  SunSpecProperty.Meter.PowerFactorB,
  SunSpecProperty.Meter.PowerFactorC,
  SunSpecProperty.Meter.ExportedEnergy,
  SunSpecProperty.Meter.ImportedEnergy,
  SunSpecProperty.Meter.Events,
] as const;

/**
 * Provides convenient access to SunSpec meter properties.
 *
 * SunSpec Model ID: 203
 */
export class MeterApi
  extends PropertyApi {

  public constructor(
    reader: SunSpecPropertyReader,
  ) {

    super(
      reader,
    );

  }

  public current():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.Current,
    );

  }

  public currentA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.CurrentA,
    );

  }

  public currentB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.CurrentB,
    );

  }

  public currentC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.CurrentC,
    );

  }

  public voltageLineNeutral():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageLineNeutral,
    );

  }

  public voltageAN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageAN,
    );

  }

  public voltageBN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageBN,
    );

  }

  public voltageCN():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageCN,
    );

  }

  public voltageLineLine():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageLineLine,
    );

  }

  public voltageAB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageAB,
    );

  }

  public voltageBC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageBC,
    );

  }

  public voltageCA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.VoltageCA,
    );

  }

  public frequency():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.Frequency,
    );

  }

  /**
   * Reads signed total meter active power.
   *
   * Positive values represent grid export.
   * Negative values represent grid import.
   */
  public activePower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ActivePower,
    );

  }

  /**
   * Reads current grid import power.
   *
   * The returned value is always greater than or equal to zero.
   */
  public async importPower():
    Promise<number> {

    const activePower =
      await this.activePower();

    return MeterApi
      .calculateImportPower(
        activePower,
      );

  }

  /**
   * Reads current grid export power.
   *
   * The returned value is always greater than or equal to zero.
   */
  public async exportPower():
    Promise<number> {

    const activePower =
      await this.activePower();

    return MeterApi
      .calculateExportPower(
        activePower,
      );

  }

  public activePowerA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ActivePowerA,
    );

  }

  public activePowerB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ActivePowerB,
    );

  }

  public activePowerC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ActivePowerC,
    );

  }

  public apparentPower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ApparentPower,
    );

  }

  public apparentPowerA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ApparentPowerA,
    );

  }

  public apparentPowerB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ApparentPowerB,
    );

  }

  public apparentPowerC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ApparentPowerC,
    );

  }

  public reactivePower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ReactivePower,
    );

  }

  public reactivePowerA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ReactivePowerA,
    );

  }

  public reactivePowerB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ReactivePowerB,
    );

  }

  public reactivePowerC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ReactivePowerC,
    );

  }

  public powerFactor():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.PowerFactor,
    );

  }

  public powerFactorA():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.PowerFactorA,
    );

  }

  public powerFactorB():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.PowerFactorB,
    );

  }

  public powerFactorC():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.PowerFactorC,
    );

  }

  public exportedEnergy():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ExportedEnergy,
    );

  }

  public importedEnergy():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ImportedEnergy,
    );

  }

  public events():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.Events,
    );

  }

  /**
   * Reads all currently exposed meter properties from one
   * coherent Modbus block snapshot.
   *
   * Import and export power are derived from the signed
   * active-power value without performing additional reads.
   */
  public async snapshot():
    Promise<MeterSnapshot> {

    const values =
      await this.readMany(
        METER_SNAPSHOT_PROPERTIES,
      );

    const activePower =
      values[
        SunSpecProperty.Meter.ActivePower
      ];

    const importPower =
      MeterApi.calculateImportPower(
        activePower,
      );

    const exportPower =
      MeterApi.calculateExportPower(
        activePower,
      );

    return {
      current:
        values[SunSpecProperty.Meter.Current],

      currentA:
        values[SunSpecProperty.Meter.CurrentA],

      currentB:
        values[SunSpecProperty.Meter.CurrentB],

      currentC:
        values[SunSpecProperty.Meter.CurrentC],

      voltageLineNeutral:
        values[SunSpecProperty.Meter.VoltageLineNeutral],

      voltageAN:
        values[SunSpecProperty.Meter.VoltageAN],

      voltageBN:
        values[SunSpecProperty.Meter.VoltageBN],

      voltageCN:
        values[SunSpecProperty.Meter.VoltageCN],

      voltageLineLine:
        values[SunSpecProperty.Meter.VoltageLineLine],

      voltageAB:
        values[SunSpecProperty.Meter.VoltageAB],

      voltageBC:
        values[SunSpecProperty.Meter.VoltageBC],

      voltageCA:
        values[SunSpecProperty.Meter.VoltageCA],

      frequency:
        values[SunSpecProperty.Meter.Frequency],

      activePower,
      importPower,
      exportPower,

      activePowerA:
        values[SunSpecProperty.Meter.ActivePowerA],

      activePowerB:
        values[SunSpecProperty.Meter.ActivePowerB],

      activePowerC:
        values[SunSpecProperty.Meter.ActivePowerC],

      apparentPower:
        values[SunSpecProperty.Meter.ApparentPower],

      apparentPowerA:
        values[SunSpecProperty.Meter.ApparentPowerA],

      apparentPowerB:
        values[SunSpecProperty.Meter.ApparentPowerB],

      apparentPowerC:
        values[SunSpecProperty.Meter.ApparentPowerC],

      reactivePower:
        values[SunSpecProperty.Meter.ReactivePower],

      reactivePowerA:
        values[SunSpecProperty.Meter.ReactivePowerA],

      reactivePowerB:
        values[SunSpecProperty.Meter.ReactivePowerB],

      reactivePowerC:
        values[SunSpecProperty.Meter.ReactivePowerC],

      powerFactor:
        values[SunSpecProperty.Meter.PowerFactor],

      powerFactorA:
        values[SunSpecProperty.Meter.PowerFactorA],

      powerFactorB:
        values[SunSpecProperty.Meter.PowerFactorB],

      powerFactorC:
        values[SunSpecProperty.Meter.PowerFactorC],

      exportedEnergy:
        values[SunSpecProperty.Meter.ExportedEnergy],

      importedEnergy:
        values[SunSpecProperty.Meter.ImportedEnergy],

      events:
        values[SunSpecProperty.Meter.Events],
    };

  }

  /**
   * Converts signed meter power into non-negative
   * grid import power.
   */
  private static calculateImportPower(
    activePower: number,
  ): number {

    return Math.max(
      0,
      -activePower,
    );

  }

  /**
   * Converts signed meter power into non-negative
   * grid export power.
   */
  private static calculateExportPower(
    activePower: number,
  ): number {

    return Math.max(
      0,
      activePower,
    );

  }

}
