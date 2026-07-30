/**
 * Well-known logical SunSpec property names.
 *
 * These constants provide IntelliSense and prevent property
 * names from being duplicated as string literals throughout
 * the public API.
 */
export const SunSpecProperty = {

  Common: {

    Manufacturer:
      'common.manufacturer',

    Model:
      'common.model',

    Options:
      'common.options',

    Version:
      'common.version',

    SerialNumber:
      'common.serialNumber',

    DeviceAddress:
      'common.deviceAddress',

  },

  Inverter: {

    AcCurrent:
      'inverter.acCurrent',

    AcCurrentA:
      'inverter.acCurrentA',

    AcCurrentB:
      'inverter.acCurrentB',

    AcCurrentC:
      'inverter.acCurrentC',

    AcVoltageAB:
      'inverter.acVoltageAB',

    AcVoltageBC:
      'inverter.acVoltageBC',

    AcVoltageCA:
      'inverter.acVoltageCA',

    AcVoltageAN:
      'inverter.acVoltageAN',

    AcVoltageBN:
      'inverter.acVoltageBN',

    AcVoltageCN:
      'inverter.acVoltageCN',

    AcPower:
      'inverter.acPower',

    Frequency:
      'inverter.frequency',

    ApparentPower:
      'inverter.apparentPower',

    ReactivePower:
      'inverter.reactivePower',

    PowerFactor:
      'inverter.powerFactor',

    DcCurrent:
      'inverter.dcCurrent',

    DcVoltage:
      'inverter.dcVoltage',

    DcPower:
      'inverter.dcPower',

    Temperature:
      'inverter.temperature',

    Status:
      'inverter.status',

  },

  Nameplate: {

    MaximumPower:
      'nameplate.maximumPower',

    MaximumCurrent:
      'nameplate.maximumCurrent',

    MaximumVoltage:
      'nameplate.maximumVoltage',

  },

} as const;