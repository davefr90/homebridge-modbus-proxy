import {
  SunSpecProperty,
} from './SunSpecProperty.js';

/**
 * Maps every supported logical SunSpec property to the value
 * type returned by the public read API.
 */
export interface SunSpecPropertyTypes {

  [SunSpecProperty.Common.Manufacturer]:
    string;

  [SunSpecProperty.Common.Model]:
    string;

  [SunSpecProperty.Common.Options]:
    string;

  [SunSpecProperty.Common.Version]:
    string;

  [SunSpecProperty.Common.SerialNumber]:
    string;

  [SunSpecProperty.Common.DeviceAddress]:
    number;

  [SunSpecProperty.Inverter.AcCurrent]:
    number;

  [SunSpecProperty.Inverter.AcCurrentA]:
    number;

  [SunSpecProperty.Inverter.AcCurrentB]:
    number;

  [SunSpecProperty.Inverter.AcCurrentC]:
    number;

  [SunSpecProperty.Inverter.AcVoltageAB]:
    number;

  [SunSpecProperty.Inverter.AcVoltageBC]:
    number;

  [SunSpecProperty.Inverter.AcVoltageCA]:
    number;

  [SunSpecProperty.Inverter.AcVoltageAN]:
    number;

  [SunSpecProperty.Inverter.AcVoltageBN]:
    number;

  [SunSpecProperty.Inverter.AcVoltageCN]:
    number;

  [SunSpecProperty.Inverter.AcPower]:
    number;

  [SunSpecProperty.Inverter.Frequency]:
    number;

  [SunSpecProperty.Inverter.ApparentPower]:
    number;

  [SunSpecProperty.Inverter.ReactivePower]:
    number;

  [SunSpecProperty.Inverter.PowerFactor]:
    number;

  [SunSpecProperty.Inverter.DcCurrent]:
    number;

  [SunSpecProperty.Inverter.DcVoltage]:
    number;

  [SunSpecProperty.Inverter.DcPower]:
    number;

  [SunSpecProperty.Inverter.Temperature]:
    number;

  [SunSpecProperty.Inverter.Status]:
    number;

  [SunSpecProperty.Nameplate.MaximumPower]:
    number;

  [SunSpecProperty.Nameplate.MaximumCurrent]:
    number;

  [SunSpecProperty.Nameplate.MaximumVoltage]:
    number;

  [SunSpecProperty.Meter.Current]:
    number;

  [SunSpecProperty.Meter.CurrentA]:
    number;

  [SunSpecProperty.Meter.CurrentB]:
    number;

  [SunSpecProperty.Meter.CurrentC]:
    number;

  [SunSpecProperty.Meter.VoltageLineNeutral]:
    number;

  [SunSpecProperty.Meter.VoltageAN]:
    number;

  [SunSpecProperty.Meter.VoltageBN]:
    number;

  [SunSpecProperty.Meter.VoltageCN]:
    number;

  [SunSpecProperty.Meter.VoltageLineLine]:
    number;

  [SunSpecProperty.Meter.VoltageAB]:
    number;

  [SunSpecProperty.Meter.VoltageBC]:
    number;

  [SunSpecProperty.Meter.VoltageCA]:
    number;

  [SunSpecProperty.Meter.Frequency]:
    number;

  [SunSpecProperty.Meter.ActivePower]:
    number;

  [SunSpecProperty.Meter.ActivePowerA]:
    number;

  [SunSpecProperty.Meter.ActivePowerB]:
    number;

  [SunSpecProperty.Meter.ActivePowerC]:
    number;

  [SunSpecProperty.Meter.ApparentPower]:
    number;

  [SunSpecProperty.Meter.ApparentPowerA]:
    number;

  [SunSpecProperty.Meter.ApparentPowerB]:
    number;

  [SunSpecProperty.Meter.ApparentPowerC]:
    number;

  [SunSpecProperty.Meter.ReactivePower]:
    number;

  [SunSpecProperty.Meter.ReactivePowerA]:
    number;

  [SunSpecProperty.Meter.ReactivePowerB]:
    number;

  [SunSpecProperty.Meter.ReactivePowerC]:
    number;

  [SunSpecProperty.Meter.PowerFactor]:
    number;

  [SunSpecProperty.Meter.PowerFactorA]:
    number;

  [SunSpecProperty.Meter.PowerFactorB]:
    number;

  [SunSpecProperty.Meter.PowerFactorC]:
    number;

  [SunSpecProperty.Meter.ExportedEnergy]:
    number;

  [SunSpecProperty.Meter.ImportedEnergy]:
    number;

  [SunSpecProperty.Meter.Events]:
    number;

  [SunSpecProperty.Storage.EnergyRating]:
    number | undefined;

  [SunSpecProperty.Storage.EnergyAvailable]:
    number | undefined;

  [SunSpecProperty.Storage.StateOfCharge]:
    number | undefined;

  [SunSpecProperty.Storage.StateOfHealth]:
    number | undefined;

  [SunSpecProperty.Storage.Status]:
    number | undefined;

  [SunSpecProperty.Battery.Manufacturer]:
    string;

  [SunSpecProperty.Battery.Model]:
    string;

  [SunSpecProperty.Battery.FirmwareVersion]:
    string;

  [SunSpecProperty.Battery.SerialNumber]:
    string;

  [SunSpecProperty.Battery.DeviceId]:
    number | undefined;

  [SunSpecProperty.Battery.RatedEnergy]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumChargeContinuousPower]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumDischargeContinuousPower]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumChargePeakPower]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumDischargePeakPower]:
    number | undefined;

  [SunSpecProperty.Battery.AverageTemperature]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumTemperature]:
    number | undefined;

  [SunSpecProperty.Battery.Voltage]:
    number | undefined;

  [SunSpecProperty.Battery.Current]:
    number | undefined;

  [SunSpecProperty.Battery.Power]:
    number | undefined;

  [SunSpecProperty.Battery.MaximumEnergy]:
    number | undefined;

  [SunSpecProperty.Battery.AvailableEnergy]:
    number | undefined;

  [SunSpecProperty.Battery.StateOfHealth]:
    number | undefined;

  [SunSpecProperty.Battery.StateOfEnergy]:
    number | undefined;

  [SunSpecProperty.Battery.Status]:
    number | undefined;

  [SunSpecProperty.Battery.StatusInternal]:
    number | undefined;

}

export type SunSpecPropertyName =
  keyof SunSpecPropertyTypes;

export type SunSpecPropertyValue<
  TProperty extends SunSpecPropertyName,
> =
  SunSpecPropertyTypes[TProperty];
