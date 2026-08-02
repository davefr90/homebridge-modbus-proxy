import type {
  RegisterDefinition,
} from '../../model/RegisterDefinition.js';

import {
  SunSpecModel,
} from '../SunSpecModel.js';

import {
  SunSpecModelBuilder,
} from '../SunSpecModelBuilder.js';

import {
  SunSpecRegisterBuilder,
} from '../SunSpecRegisterBuilder.js';

import {
  InverterModel103Register,
} from './InverterModel103Register.js';

/**
 * Creates the SunSpec three-phase inverter monitoring model.
 *
 * SunSpec Model ID: 103
 */
export class InverterModel103 {

  public static readonly MODEL_ID =
    103;

  public static readonly MODEL_LENGTH =
    50;

  /**
   * Default model-header address when model 103 follows the
   * standard Common Model beginning at address 40000.
   */
  public static readonly DEFAULT_MODEL_START_ADDRESS =
    40070;

  /**
   * Creates all inverter points currently exposed by
   * InverterApi and InverterSnapshot.
   */
  public static create(
    unitId = 1,
    modelStartAddress =
    InverterModel103.DEFAULT_MODEL_START_ADDRESS,
  ): SunSpecModel {

    InverterModel103.validateModelStartAddress(
      modelStartAddress,
    );

    const dataStartAddress =
      modelStartAddress + 2;

    const builder =
      SunSpecModelBuilder
        .create()
        .id(
          InverterModel103.MODEL_ID,
        )
        .name(
          'Three-Phase Inverter',
        );

    InverterModel103.addCurrentRegisters(
      builder,
      unitId,
      dataStartAddress,
    );

    InverterModel103.addVoltageRegisters(
      builder,
      unitId,
      dataStartAddress,
    );

    InverterModel103.addAcPowerRegisters(
      builder,
      unitId,
      dataStartAddress,
    );

    InverterModel103.addDcRegisters(
      builder,
      unitId,
      dataStartAddress,
    );

    InverterModel103.addConditionRegisters(
      builder,
      unitId,
      dataStartAddress,
    );

    return builder.build();

  }

  private static addCurrentRegisters(
    builder: SunSpecModelBuilder,
    unitId: number,
    dataStartAddress: number,
  ): void {

    builder
      .register(
        'acCurrentScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_CURRENT_SCALE_FACTOR,
          'AC Current Scale Factor',
        ),
      )
      .register(
        'acCurrent',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_CURRENT,
          'acCurrentScaleFactor',
          'AC Current',
          'A',
        ),
      )
      .register(
        'acCurrentA',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_CURRENT_PHASE_A,
          'acCurrentScaleFactor',
          'AC Current Phase A',
          'A',
        ),
      )
      .register(
        'acCurrentB',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_CURRENT_PHASE_B,
          'acCurrentScaleFactor',
          'AC Current Phase B',
          'A',
        ),
      )
      .register(
        'acCurrentC',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_CURRENT_PHASE_C,
          'acCurrentScaleFactor',
          'AC Current Phase C',
          'A',
        ),
      );

  }

  private static addVoltageRegisters(
    builder: SunSpecModelBuilder,
    unitId: number,
    dataStartAddress: number,
  ): void {

    builder
      .register(
        'acVoltageScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_SCALE_FACTOR,
          'AC Voltage Scale Factor',
        ),
      )
      .register(
        'acVoltageAB',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_AB,
          'acVoltageScaleFactor',
          'AC Voltage AB',
          'V',
        ),
      )
      .register(
        'acVoltageBC',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_BC,
          'acVoltageScaleFactor',
          'AC Voltage BC',
          'V',
        ),
      )
      .register(
        'acVoltageCA',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_CA,
          'acVoltageScaleFactor',
          'AC Voltage CA',
          'V',
        ),
      )
      .register(
        'acVoltageAN',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_AN,
          'acVoltageScaleFactor',
          'AC Voltage AN',
          'V',
        ),
      )
      .register(
        'acVoltageBN',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_BN,
          'acVoltageScaleFactor',
          'AC Voltage BN',
          'V',
        ),
      )
      .register(
        'acVoltageCN',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_VOLTAGE_CN,
          'acVoltageScaleFactor',
          'AC Voltage CN',
          'V',
        ),
      );

  }

  private static addAcPowerRegisters(
    builder: SunSpecModelBuilder,
    unitId: number,
    dataStartAddress: number,
  ): void {

    builder
      .register(
        'acPowerScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_POWER_SCALE_FACTOR,
          'AC Power Scale Factor',
        ),
      )
      .register(
        'acPower',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.AC_POWER,
          'acPowerScaleFactor',
          'AC Power',
          'W',
        ),
      )
      .register(
        'frequencyScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.FREQUENCY_SCALE_FACTOR,
          'Frequency Scale Factor',
        ),
      )
      .register(
        'frequency',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.FREQUENCY,
          'frequencyScaleFactor',
          'Frequency',
          'Hz',
        ),
      )
      .register(
        'apparentPowerScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.APPARENT_POWER_SCALE_FACTOR,
          'Apparent Power Scale Factor',
        ),
      )
      .register(
        'apparentPower',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.APPARENT_POWER,
          'apparentPowerScaleFactor',
          'Apparent Power',
          'VA',
        ),
      )
      .register(
        'reactivePowerScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.REACTIVE_POWER_SCALE_FACTOR,
          'Reactive Power Scale Factor',
        ),
      )
      .register(
        'reactivePower',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.REACTIVE_POWER,
          'reactivePowerScaleFactor',
          'Reactive Power',
          'var',
        ),
      )
      .register(
        'powerFactorScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.POWER_FACTOR_SCALE_FACTOR,
          'Power Factor Scale Factor',
        ),
      )
      .register(
        'powerFactor',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.POWER_FACTOR,
          'powerFactorScaleFactor',
          'Power Factor',
          '%',
        ),
      );

  }

  private static addDcRegisters(
    builder: SunSpecModelBuilder,
    unitId: number,
    dataStartAddress: number,
  ): void {

    builder
      .register(
        'dcCurrentScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_CURRENT_SCALE_FACTOR,
          'DC Current Scale Factor',
        ),
      )
      .register(
        'dcCurrent',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_CURRENT,
          'dcCurrentScaleFactor',
          'DC Current',
          'A',
        ),
      )
      .register(
        'dcVoltageScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_VOLTAGE_SCALE_FACTOR,
          'DC Voltage Scale Factor',
        ),
      )
      .register(
        'dcVoltage',
        InverterModel103.uint16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_VOLTAGE,
          'dcVoltageScaleFactor',
          'DC Voltage',
          'V',
        ),
      )
      .register(
        'dcPowerScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_POWER_SCALE_FACTOR,
          'DC Power Scale Factor',
        ),
      )
      .register(
        'dcPower',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.DC_POWER,
          'dcPowerScaleFactor',
          'DC Power',
          'W',
        ),
      );

  }

  private static addConditionRegisters(
    builder: SunSpecModelBuilder,
    unitId: number,
    dataStartAddress: number,
  ): void {

    builder
      .register(
        'temperatureScaleFactor',
        InverterModel103.scaleFactorDefinition(
          unitId,
          dataStartAddress
          + InverterModel103Register.TEMPERATURE_SCALE_FACTOR,
          'Temperature Scale Factor',
        ),
      )
      .register(
        'temperature',
        InverterModel103.int16Definition(
          unitId,
          dataStartAddress
          + InverterModel103Register.CABINET_TEMPERATURE,
          'temperatureScaleFactor',
          'Cabinet Temperature',
          '°C',
          -32768,
        ),
      )
      .register(
        'status',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register.STATUS,
          )
          .enum16()
          .name(
            'Operating Status',
          )
          .build(),
      );

  }

  private static scaleFactorDefinition(
    unitId: number,
    address: number,
    name: string,
  ): RegisterDefinition {

    return SunSpecRegisterBuilder
      .create(
        unitId,
        address,
      )
      .sunssf()
      .name(
        name,
      )
      .build();

  }

  private static uint16Definition(
    unitId: number,
    address: number,
    scaleProperty: string,
    name: string,
    unit: string,
  ): RegisterDefinition {

    return SunSpecRegisterBuilder
      .create(
        unitId,
        address,
      )
      .uint16()
      .scaleProperty(
        scaleProperty,
      )
      .name(
        name,
      )
      .unit(
        unit,
      )
      .build();

  }

  private static int16Definition(
    unitId: number,
    address: number,
    scaleProperty: string,
    name: string,
    unit: string,
    notImplementedValue?: number,
  ): RegisterDefinition {

    const builder =
      SunSpecRegisterBuilder
        .create(
          unitId,
          address,
        )
        .int16()
        .scaleProperty(
          scaleProperty,
        )
        .name(
          name,
        )
        .unit(
          unit,
        );

    if (notImplementedValue !== undefined) {
      builder.notImplementedValue(
        notImplementedValue,
      );
    }

    return builder.build();

  }

  private static validateModelStartAddress(
    modelStartAddress: number,
  ): void {

    const maximumModelStartAddress =
      65536
      - 2
      - InverterModel103.MODEL_LENGTH;

    if (
      !Number.isInteger(modelStartAddress)
      || modelStartAddress < 0
      || modelStartAddress > maximumModelStartAddress
    ) {
      throw new Error(
        `Invalid SunSpec model start address: ${modelStartAddress}`,
      );
    }

  }

}
