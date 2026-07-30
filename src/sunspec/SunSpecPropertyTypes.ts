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

}

/**
 * Union of all supported logical SunSpec property names.
 */
export type SunSpecPropertyName =
  keyof SunSpecPropertyTypes;

/**
 * Resolves the returned value type for a logical property.
 */
export type SunSpecPropertyValue<
  TProperty extends SunSpecPropertyName,
> =
  SunSpecPropertyTypes[TProperty];