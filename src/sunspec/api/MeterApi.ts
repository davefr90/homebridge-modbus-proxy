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

  public activePower():
    Promise<number> {

    return this.read(
      SunSpecProperty.Meter.ActivePower,
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
   * Reads all currently exposed meter properties.
   */
  public async snapshot():
    Promise<MeterSnapshot> {

    const [
      current,
      currentA,
      currentB,
      currentC,
      voltageLineNeutral,
      voltageAN,
      voltageBN,
      voltageCN,
      voltageLineLine,
      voltageAB,
      voltageBC,
      voltageCA,
      frequency,
      activePower,
      activePowerA,
      activePowerB,
      activePowerC,
      apparentPower,
      apparentPowerA,
      apparentPowerB,
      apparentPowerC,
      reactivePower,
      reactivePowerA,
      reactivePowerB,
      reactivePowerC,
      powerFactor,
      powerFactorA,
      powerFactorB,
      powerFactorC,
      exportedEnergy,
      importedEnergy,
      events,
    ] = await Promise.all([
      this.current(),
      this.currentA(),
      this.currentB(),
      this.currentC(),
      this.voltageLineNeutral(),
      this.voltageAN(),
      this.voltageBN(),
      this.voltageCN(),
      this.voltageLineLine(),
      this.voltageAB(),
      this.voltageBC(),
      this.voltageCA(),
      this.frequency(),
      this.activePower(),
      this.activePowerA(),
      this.activePowerB(),
      this.activePowerC(),
      this.apparentPower(),
      this.apparentPowerA(),
      this.apparentPowerB(),
      this.apparentPowerC(),
      this.reactivePower(),
      this.reactivePowerA(),
      this.reactivePowerB(),
      this.reactivePowerC(),
      this.powerFactor(),
      this.powerFactorA(),
      this.powerFactorB(),
      this.powerFactorC(),
      this.exportedEnergy(),
      this.importedEnergy(),
      this.events(),
    ]);

    return {
      current,
      currentA,
      currentB,
      currentC,
      voltageLineNeutral,
      voltageAN,
      voltageBN,
      voltageCN,
      voltageLineLine,
      voltageAB,
      voltageBC,
      voltageCA,
      frequency,
      activePower,
      activePowerA,
      activePowerB,
      activePowerC,
      apparentPower,
      apparentPowerA,
      apparentPowerB,
      apparentPowerC,
      reactivePower,
      reactivePowerA,
      reactivePowerB,
      reactivePowerC,
      powerFactor,
      powerFactorA,
      powerFactorB,
      powerFactorC,
      exportedEnergy,
      importedEnergy,
      events,
    };

  }

}