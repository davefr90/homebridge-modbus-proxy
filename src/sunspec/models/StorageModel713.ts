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
  StorageModel713Register,
} from './StorageModel713Register.js';

/**
 * Creates the SunSpec DER Storage Capacity Model.
 *
 * SunSpec Model ID: 713
 */
export class StorageModel713 {

  /**
   * SunSpec DER Storage Capacity model identifier.
   */
  public static readonly MODEL_ID =
    713;

  /**
   * Number of data registers in SunSpec Model 713.
   */
  public static readonly MODEL_LENGTH =
    7;

  /**
   * Creates SunSpec storage model 713.
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
      || modelStartAddress > 65527
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
        StorageModel713.MODEL_ID,
      )
      .name(
        'DER Storage Capacity',
      )
      .register(
        'energyScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.ENERGY_SCALE_FACTOR,
          )
          .sunssf()
          .notImplementedValue(
            -32768,
          )
          .name(
            'Energy Scale Factor',
          )
          .build(),
      )
      .register(
        'energyRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.ENERGY_RATING,
          )
          .uint16()
          .notImplementedValue(
            0xFFFF,
          )
          .scaleProperty(
            'energyScaleFactor',
          )
          .name(
            'Energy Rating',
          )
          .unit(
            'Wh',
          )
          .build(),
      )
      .register(
        'energyAvailable',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.ENERGY_AVAILABLE,
          )
          .uint16()
          .notImplementedValue(
            0xFFFF,
          )
          .scaleProperty(
            'energyScaleFactor',
          )
          .name(
            'Energy Available',
          )
          .unit(
            'Wh',
          )
          .build(),
      )
      .register(
        'percentageScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.PERCENTAGE_SCALE_FACTOR,
          )
          .sunssf()
          .notImplementedValue(
            -32768,
          )
          .name(
            'Percentage Scale Factor',
          )
          .build(),
      )
      .register(
        'stateOfCharge',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.STATE_OF_CHARGE,
          )
          .uint16()
          .notImplementedValue(
            0xFFFF,
          )
          .scaleProperty(
            'percentageScaleFactor',
          )
          .name(
            'State of Charge',
          )
          .unit(
            '%',
          )
          .build(),
      )
      .register(
        'stateOfHealth',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.STATE_OF_HEALTH,
          )
          .uint16()
          .notImplementedValue(
            0xFFFF,
          )
          .scaleProperty(
            'percentageScaleFactor',
          )
          .name(
            'State of Health',
          )
          .unit(
            '%',
          )
          .build(),
      )
      .register(
        'status',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + StorageModel713Register.STATUS,
          )
          .enum16()
          .notImplementedValue(
            0xFFFF,
          )
          .name(
            'Storage Status',
          )
          .build(),
      )
      .build();

  }

}
