/**
 * Well-known logical SunSpec property names.
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

  Meter: {

    Current:
      'meter.current',

    CurrentA:
      'meter.currentA',

    CurrentB:
      'meter.currentB',

    CurrentC:
      'meter.currentC',

    VoltageLineNeutral:
      'meter.voltageLineNeutral',

    VoltageAN:
      'meter.voltageAN',

    VoltageBN:
      'meter.voltageBN',

    VoltageCN:
      'meter.voltageCN',

    VoltageLineLine:
      'meter.voltageLineLine',

    VoltageAB:
      'meter.voltageAB',

    VoltageBC:
      'meter.voltageBC',

    VoltageCA:
      'meter.voltageCA',

    Frequency:
      'meter.frequency',

    ActivePower:
      'meter.activePower',

    ActivePowerA:
      'meter.activePowerA',

    ActivePowerB:
      'meter.activePowerB',

    ActivePowerC:
      'meter.activePowerC',

    ApparentPower:
      'meter.apparentPower',

    ApparentPowerA:
      'meter.apparentPowerA',

    ApparentPowerB:
      'meter.apparentPowerB',

    ApparentPowerC:
      'meter.apparentPowerC',

    ReactivePower:
      'meter.reactivePower',

    ReactivePowerA:
      'meter.reactivePowerA',

    ReactivePowerB:
      'meter.reactivePowerB',

    ReactivePowerC:
      'meter.reactivePowerC',

    PowerFactor:
      'meter.powerFactor',

    PowerFactorA:
      'meter.powerFactorA',

    PowerFactorB:
      'meter.powerFactorB',

    PowerFactorC:
      'meter.powerFactorC',

    ExportedEnergy:
      'meter.exportedEnergy',

    ImportedEnergy:
      'meter.importedEnergy',

    Events:
      'meter.events',

  },

  Storage: {

    EnergyRating:
      'storage.energyRating',

    EnergyAvailable:
      'storage.energyAvailable',

    StateOfCharge:
      'storage.stateOfCharge',

    StateOfHealth:
      'storage.stateOfHealth',

    Status:
      'storage.status',

  },

} as const;
