import { SunSpecModel } from '../SunSpecModel.js';
import { SunSpecModelBuilder } from '../SunSpecModelBuilder.js';
import { SunSpecRegisterBuilder } from '../SunSpecRegisterBuilder.js';
import { InverterModel103Register } from './InverterModel103Register.js';

/**
 * Creates the SunSpec three-phase inverter monitoring model.
 *
 * SunSpec Model ID: 103
 *
 * This implementation is initially limited to the AC-current
 * register group and will be expanded incrementally.
 */
export class InverterModel103 {

  /**
   * SunSpec three-phase inverter model identifier.
   */
  public static readonly MODEL_ID = 103;

  /**
 * Number of data registers in SunSpec Model 103.
 */
  public static readonly MODEL_LENGTH = 50;

  /**
   * Default model-header address when model 103 follows
   * the standard Common Model beginning at address 40000.
   *
   * The model ID is located at this address.
   * The model length follows at the next address.
   */
  public static readonly DEFAULT_MODEL_START_ADDRESS = 40070;

  /**
   * Creates SunSpec inverter model 103.
   *
   * @param unitId Modbus unit identifier.
   * @param modelStartAddress Address of the model ID register.
   */
  public static create(
    unitId = 1,
    modelStartAddress =
      InverterModel103.DEFAULT_MODEL_START_ADDRESS,
  ): SunSpecModel {

    if (
      !Number.isInteger(
        modelStartAddress,
      )
      || modelStartAddress < 0
      || modelStartAddress > 65529
    ) {
      throw new Error(
        `Invalid SunSpec model start address: ${modelStartAddress}`,
      );
    }

    const dataStartAddress =
      modelStartAddress + 2;

    return SunSpecModelBuilder
      .create()
      .id(
        InverterModel103.MODEL_ID,
      )
      .name(
        'Three-Phase Inverter',
      )
      .register(
        'acCurrentScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register
              .AC_CURRENT_SCALE_FACTOR,
          )
          .int16()
          .name(
            'AC Current Scale Factor',
          )
          .build(),
      )
      .register(
        'acCurrent',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register
              .AC_CURRENT,
          )
          .uint16()
          .scaleProperty(
            'acCurrentScaleFactor',
          )
          .name(
            'AC Current',
          )
          .unit(
            'A',
          )
          .build(),
      )
      .register(
        'acCurrentPhaseA',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register
              .AC_CURRENT_PHASE_A,
          )
          .uint16()
          .scaleProperty(
            'acCurrentScaleFactor',
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
        'acCurrentPhaseB',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register
              .AC_CURRENT_PHASE_B,
          )
          .uint16()
          .scaleProperty(
            'acCurrentScaleFactor',
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
        'acCurrentPhaseC',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + InverterModel103Register
              .AC_CURRENT_PHASE_C,
          )
          .uint16()
          .scaleProperty(
            'acCurrentScaleFactor',
          )
          .name(
            'AC Current Phase C',
          )
          .unit(
            'A',
          )
          .build(),
      )
      .build();

  }

}