import { SunSpecModel } from '../SunSpecModel.js';
import { SunSpecModelBuilder } from '../SunSpecModelBuilder.js';
import { SunSpecRegisterBuilder } from '../SunSpecRegisterBuilder.js';
import { NameplateModel120Register } from './NameplateModel120Register.js';

/**
 * Creates SunSpec Model 120:
 * Inverter Controls Nameplate Ratings.
 */
export class NameplateModel120 {

  /**
   * SunSpec model identifier.
   */
  public static readonly MODEL_ID = 120;

  /**
   * Number of data registers in SunSpec Model 120.
   */
  public static readonly MODEL_LENGTH = 26;

  /**
   * Default model start address.
   *
   * Model ID register.
   */
  public static readonly DEFAULT_MODEL_START_ADDRESS = 40070;

  /**
   * Creates SunSpec Model 120.
   *
   * @param unitId Modbus unit identifier.
   * @param modelStartAddress Address of the model identifier.
   */
  public static create(
    unitId = 1,
    modelStartAddress =
      NameplateModel120.DEFAULT_MODEL_START_ADDRESS,
  ): SunSpecModel {

    if (
      !Number.isInteger(
        modelStartAddress,
      )
      || modelStartAddress < 0
      || modelStartAddress > 65509
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
        NameplateModel120.MODEL_ID,
      )
      .name(
        'Nameplate Ratings',
      )

      .register(
        'derType',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register.DER_TYPE,
          )
          .enum16()
          .name(
            'DER Type',
          )
          .build(),
      )

      .register(
        'continuousActivePowerRatingScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_ACTIVE_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Continuous Active Power Scale Factor',
          )
          .build(),
      )

      .register(
        'continuousActivePowerRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_ACTIVE_POWER_RATING,
          )
          .uint16()
          .scaleProperty(
            'continuousActivePowerRatingScaleFactor',
          )
          .name(
            'Continuous Active Power Rating',
          )
          .unit(
            'W',
          )
          .build(),
      )

      .register(
        'continuousApparentPowerRatingScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_APPARENT_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Continuous Apparent Power Scale Factor',
          )
          .build(),
      )

      .register(
        'continuousApparentPowerRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_APPARENT_POWER_RATING,
          )
          .uint16()
          .scaleProperty(
            'continuousApparentPowerRatingScaleFactor',
          )
          .name(
            'Continuous Apparent Power Rating',
          )
          .unit(
            'VA',
          )
          .build(),
      )

      .register(
        'continuousReactivePowerScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_REACTIVE_POWER_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Continuous Reactive Power Scale Factor',
          )
          .build(),
      )

      .register(
        'continuousReactivePowerRatingQuadrant1',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_REACTIVE_POWER_RATING_QUADRANT_1,
          )
          .int16()
          .scaleProperty(
            'continuousReactivePowerScaleFactor',
          )
          .name(
            'Continuous Reactive Power Rating Quadrant 1',
          )
          .unit(
            'var',
          )
          .build(),
      )

      .register(
        'continuousReactivePowerRatingQuadrant2',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_REACTIVE_POWER_RATING_QUADRANT_2,
          )
          .int16()
          .scaleProperty(
            'continuousReactivePowerScaleFactor',
          )
          .name(
            'Continuous Reactive Power Rating Quadrant 2',
          )
          .unit(
            'var',
          )
          .build(),
      )

      .register(
        'continuousReactivePowerRatingQuadrant3',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_REACTIVE_POWER_RATING_QUADRANT_3,
          )
          .int16()
          .scaleProperty(
            'continuousReactivePowerScaleFactor',
          )
          .name(
            'Continuous Reactive Power Rating Quadrant 3',
          )
          .unit(
            'var',
          )
          .build(),
      )

      .register(
        'continuousReactivePowerRatingQuadrant4',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .CONTINUOUS_REACTIVE_POWER_RATING_QUADRANT_4,
          )
          .int16()
          .scaleProperty(
            'continuousReactivePowerScaleFactor',
          )
          .name(
            'Continuous Reactive Power Rating Quadrant 4',
          )
          .unit(
            'var',
          )
          .build(),
      )

      .register(
        'maximumAcCurrentScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_AC_CURRENT_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Maximum AC Current Scale Factor',
          )
          .build(),
      )

      .register(
        'maximumAcCurrentRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_AC_CURRENT_RATING,
          )
          .uint16()
          .scaleProperty(
            'maximumAcCurrentScaleFactor',
          )
          .name(
            'Maximum AC Current Rating',
          )
          .unit(
            'A',
          )
          .build(),
      )

      .register(
        'minimumPowerFactorScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MINIMUM_POWER_FACTOR_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Minimum Power Factor Scale Factor',
          )
          .build(),
      )

      .register(
        'minimumPowerFactorQuadrant1',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MINIMUM_POWER_FACTOR_RATING_QUADRANT_1,
          )
          .int16()
          .scaleProperty(
            'minimumPowerFactorScaleFactor',
          )
          .name(
            'Minimum Power Factor Quadrant 1',
          )
          .build(),
      )

      .register(
        'minimumPowerFactorQuadrant2',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MINIMUM_POWER_FACTOR_RATING_QUADRANT_2,
          )
          .int16()
          .scaleProperty(
            'minimumPowerFactorScaleFactor',
          )
          .name(
            'Minimum Power Factor Quadrant 2',
          )
          .build(),
      )

      .register(
        'minimumPowerFactorQuadrant3',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MINIMUM_POWER_FACTOR_RATING_QUADRANT_3,
          )
          .int16()
          .scaleProperty(
            'minimumPowerFactorScaleFactor',
          )
          .name(
            'Minimum Power Factor Quadrant 3',
          )
          .build(),
      )

      .register(
        'minimumPowerFactorQuadrant4',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MINIMUM_POWER_FACTOR_RATING_QUADRANT_4,
          )
          .int16()
          .scaleProperty(
            'minimumPowerFactorScaleFactor',
          )
          .name(
            'Minimum Power Factor Quadrant 4',
          )
          .build(),
      )

      .register(
        'nominalEnergyScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .NOMINAL_ENERGY_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Nominal Energy Scale Factor',
          )
          .build(),
      )

      .register(
        'nominalEnergyRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .NOMINAL_ENERGY_RATING,
          )
          .uint32()
          .scaleProperty(
            'nominalEnergyScaleFactor',
          )
          .name(
            'Nominal Energy Rating',
          )
          .unit(
            'Wh',
          )
          .build(),
      )

      .register(
        'ampHourRatingScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .AMP_HOUR_RATING_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Amp Hour Rating Scale Factor',
          )
          .build(),
      )

      .register(
        'ampHourRating',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .AMP_HOUR_RATING,
          )
          .uint32()
          .scaleProperty(
            'ampHourRatingScaleFactor',
          )
          .name(
            'Amp Hour Rating',
          )
          .unit(
            'Ah',
          )
          .build(),
      )

      .register(
        'maximumChargeRateScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_CHARGE_RATE_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Maximum Charge Rate Scale Factor',
          )
          .build(),
      )

      .register(
        'maximumChargeRate',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_CHARGE_RATE,
          )
          .uint16()
          .scaleProperty(
            'maximumChargeRateScaleFactor',
          )
          .name(
            'Maximum Charge Rate',
          )
          .unit(
            'W',
          )
          .build(),
      )

      .register(
        'maximumDischargeRateScaleFactor',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_DISCHARGE_RATE_SCALE_FACTOR,
          )
          .sunssf()
          .name(
            'Maximum Discharge Rate Scale Factor',
          )
          .build(),
      )

      .register(
        'maximumDischargeRate',
        SunSpecRegisterBuilder
          .create(
            unitId,
            dataStartAddress
            + NameplateModel120Register
              .MAXIMUM_DISCHARGE_RATE,
          )
          .uint16()
          .scaleProperty(
            'maximumDischargeRateScaleFactor',
          )
          .name(
            'Maximum Discharge Rate',
          )
          .unit(
            'W',
          )
          .build(),
      )

      .build();

  }

}