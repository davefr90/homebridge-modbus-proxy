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
  MeterModel203Register,
} from './MeterModel203Register.js';

/**
 * Creates the SunSpec wye-connected three-phase meter model.
 *
 * SunSpec Model ID: 203
 */
export class MeterModel203 {

  /**
   * SunSpec three-phase meter model identifier.
   */
  public static readonly MODEL_ID =
    203;

  /**
   * Number of data registers in SunSpec Model 203.
   */
  public static readonly MODEL_LENGTH =
    105;

  /**
   * Creates SunSpec meter model 203.
   *
   * @param unitId Modbus unit identifier.
   * @param modelStartAddress Address of the model-ID register.
   */
  public static create(
    unitId: number,
    modelStartAddress: number,
  ): SunSpecModel {

    if (
      !Number.isInteger(
        modelStartAddress,
      )
      || modelStartAddress < 0
      || modelStartAddress > 65428
    ) {
      throw new Error(
        `Invalid SunSpec model start address: ${modelStartAddress}`,
      );
    }

    const dataStartAddress =
      modelStartAddress + 2;

    const builder =
      SunSpecModelBuilder
        .create()
        .id(
          MeterModel203.MODEL_ID,
        )
        .name(
          'Three-Phase Meter',
        );

    builder
      .register(
        'currentScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.CURRENT_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Current Scale Factor',
          )
          .build(),
      )
      .register(
        'current',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.CURRENT,
          )
          .int16()
          .scaleProperty(
            'currentScaleFactor',
          )
          .name(
            'Total AC Current',
          )
          .unit(
            'A',
          )
          .build(),
      )
      .register(
        'currentA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.CURRENT_PHASE_A,
          )
          .int16()
          .scaleProperty(
            'currentScaleFactor',
          )
          .name(
            'AC Current Phase A',
          )
          .unit(
            'A',
          )
          .build(),
      )
      .register(
        'currentB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.CURRENT_PHASE_B,
          )
          .int16()
          .scaleProperty(
            'currentScaleFactor',
          )
          .name(
            'AC Current Phase B',
          )
          .unit(
            'A',
          )
          .build(),
      )
      .register(
        'currentC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.CURRENT_PHASE_C,
          )
          .int16()
          .scaleProperty(
            'currentScaleFactor',
          )
          .name(
            'AC Current Phase C',
          )
          .unit(
            'A',
          )
          .build(),
      );

    builder
      .register(
        'voltageScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Voltage Scale Factor',
          )
          .build(),
      )
      .register(
        'voltageLineNeutral',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_LINE_NEUTRAL,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Average Line-to-Neutral Voltage',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageAN',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_AN,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase AN',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageBN',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_BN,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase BN',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageCN',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_CN,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase CN',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageLineLine',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_LINE_LINE,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Average Line-to-Line Voltage',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageAB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_AB,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase AB',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageBC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_BC,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase BC',
          )
          .unit(
            'V',
          )
          .build(),
      )
      .register(
        'voltageCA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.VOLTAGE_PHASE_CA,
          )
          .int16()
          .scaleProperty(
            'voltageScaleFactor',
          )
          .name(
            'Voltage Phase CA',
          )
          .unit(
            'V',
          )
          .build(),
      );

    builder
      .register(
        'frequencyScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.FREQUENCY_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Frequency Scale Factor',
          )
          .build(),
      )
      .register(
        'frequency',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.FREQUENCY,
          )
          .int16()
          .scaleProperty(
            'frequencyScaleFactor',
          )
          .name(
            'Frequency',
          )
          .unit(
            'Hz',
          )
          .build(),
      );

    builder
      .register(
        'activePowerScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ACTIVE_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Active Power Scale Factor',
          )
          .build(),
      )
      .register(
        'activePower',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ACTIVE_POWER,
          )
          .int16()
          .scaleProperty(
            'activePowerScaleFactor',
          )
          .name(
            'Total Active Power',
          )
          .unit(
            'W',
          )
          .build(),
      )
      .register(
        'activePowerA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ACTIVE_POWER_PHASE_A,
          )
          .int16()
          .scaleProperty(
            'activePowerScaleFactor',
          )
          .name(
            'Active Power Phase A',
          )
          .unit(
            'W',
          )
          .build(),
      )
      .register(
        'activePowerB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ACTIVE_POWER_PHASE_B,
          )
          .int16()
          .scaleProperty(
            'activePowerScaleFactor',
          )
          .name(
            'Active Power Phase B',
          )
          .unit(
            'W',
          )
          .build(),
      )
      .register(
        'activePowerC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ACTIVE_POWER_PHASE_C,
          )
          .int16()
          .scaleProperty(
            'activePowerScaleFactor',
          )
          .name(
            'Active Power Phase C',
          )
          .unit(
            'W',
          )
          .build(),
      );

    builder
      .register(
        'apparentPowerScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.APPARENT_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Apparent Power Scale Factor',
          )
          .build(),
      )
      .register(
        'apparentPower',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.APPARENT_POWER,
          )
          .int16()
          .scaleProperty(
            'apparentPowerScaleFactor',
          )
          .name(
            'Total Apparent Power',
          )
          .unit(
            'VA',
          )
          .build(),
      )
      .register(
        'apparentPowerA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.APPARENT_POWER_PHASE_A,
          )
          .int16()
          .scaleProperty(
            'apparentPowerScaleFactor',
          )
          .name(
            'Apparent Power Phase A',
          )
          .unit(
            'VA',
          )
          .build(),
      )
      .register(
        'apparentPowerB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.APPARENT_POWER_PHASE_B,
          )
          .int16()
          .scaleProperty(
            'apparentPowerScaleFactor',
          )
          .name(
            'Apparent Power Phase B',
          )
          .unit(
            'VA',
          )
          .build(),
      )
      .register(
        'apparentPowerC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.APPARENT_POWER_PHASE_C,
          )
          .int16()
          .scaleProperty(
            'apparentPowerScaleFactor',
          )
          .name(
            'Apparent Power Phase C',
          )
          .unit(
            'VA',
          )
          .build(),
      );

    builder
      .register(
        'reactivePowerScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.REACTIVE_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Reactive Power Scale Factor',
          )
          .build(),
      )
      .register(
        'reactivePower',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.REACTIVE_POWER,
          )
          .int16()
          .scaleProperty(
            'reactivePowerScaleFactor',
          )
          .name(
            'Total Reactive Power',
          )
          .unit(
            'var',
          )
          .build(),
      )
      .register(
        'reactivePowerA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.REACTIVE_POWER_PHASE_A,
          )
          .int16()
          .scaleProperty(
            'reactivePowerScaleFactor',
          )
          .name(
            'Reactive Power Phase A',
          )
          .unit(
            'var',
          )
          .build(),
      )
      .register(
        'reactivePowerB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.REACTIVE_POWER_PHASE_B,
          )
          .int16()
          .scaleProperty(
            'reactivePowerScaleFactor',
          )
          .name(
            'Reactive Power Phase B',
          )
          .unit(
            'var',
          )
          .build(),
      )
      .register(
        'reactivePowerC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.REACTIVE_POWER_PHASE_C,
          )
          .int16()
          .scaleProperty(
            'reactivePowerScaleFactor',
          )
          .name(
            'Reactive Power Phase C',
          )
          .unit(
            'var',
          )
          .build(),
      );

    builder
      .register(
        'powerFactorScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.POWER_FACTOR_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Power Factor Scale Factor',
          )
          .build(),
      )
      .register(
        'powerFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.POWER_FACTOR,
          )
          .int16()
          .scaleProperty(
            'powerFactorScaleFactor',
          )
          .name(
            'Total Power Factor',
          )
          .unit(
            '%',
          )
          .build(),
      )
      .register(
        'powerFactorA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.POWER_FACTOR_PHASE_A,
          )
          .int16()
          .scaleProperty(
            'powerFactorScaleFactor',
          )
          .name(
            'Power Factor Phase A',
          )
          .unit(
            '%',
          )
          .build(),
      )
      .register(
        'powerFactorB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.POWER_FACTOR_PHASE_B,
          )
          .int16()
          .scaleProperty(
            'powerFactorScaleFactor',
          )
          .name(
            'Power Factor Phase B',
          )
          .unit(
            '%',
          )
          .build(),
      )
      .register(
        'powerFactorC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.POWER_FACTOR_PHASE_C,
          )
          .int16()
          .scaleProperty(
            'powerFactorScaleFactor',
          )
          .name(
            'Power Factor Phase C',
          )
          .unit(
            '%',
          )
          .build(),
      );

    builder
      .register(
        'energyScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.ENERGY_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Energy Scale Factor',
          )
          .build(),
      )
      .register(
        'exportedEnergy',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.EXPORTED_ENERGY,
          )
          .acc32()
          .scaleProperty(
            'energyScaleFactor',
          )
          .name(
            'Total Exported Energy',
          )
          .unit(
            'Wh',
          )
          .build(),
      )
      .register(
        'importedEnergy',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.IMPORTED_ENERGY,
          )
          .acc32()
          .scaleProperty(
            'energyScaleFactor',
          )
          .name(
            'Total Imported Energy',
          )
          .unit(
            'Wh',
          )
          .build(),
      );

    builder
      .register(
        'events',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + MeterModel203Register.EVENTS,
          )
          .bitfield32()
          .name(
            'Meter Event Flags',
          )
          .build(),
      );

    return builder.build();

  }

}