import { RegisterDataType } from '../../model/RegisterDataType.js';
import { RegisterDefinitionBuilder } from '../../model/RegisterDefinitionBuilder.js';
import { SunSpecModel } from '../SunSpecModel.js';
import { SunSpecModelBuilder } from '../SunSpecModelBuilder.js';

/**
 * Creates the SunSpec Common Model.
 *
 * SunSpec Model ID: 1
 *
 * The Common Model contains general device information such as:
 * - manufacturer
 * - model
 * - options
 * - firmware version
 * - serial number
 * - device address
 */
export class CommonModel {

  /**
   * SunSpec Common Model identifier.
   */
  public static readonly MODEL_ID = 1;

  /**
   * Number of data registers in the Common Model
   * without the optional final pad register.
   */
  public static readonly MODEL_LENGTH_WITHOUT_PAD = 65;

  /**
   * Number of data registers in the Common Model
   * including the optional final pad register.
   */
  public static readonly MODEL_LENGTH = 66;

  /**
   * Default SunSpec Modbus protocol base address.
   *
   * This is the zero-based Modbus protocol address corresponding
   * to PLC register address 40001.
   */
  public static readonly DEFAULT_BASE_ADDRESS = 40000;

  /**
   * Creates the SunSpec Common Model.
   *
   * @param unitId Modbus unit identifier.
   * @param baseAddress Zero-based SunSpec Modbus protocol base address.
   */
  public static create(
    unitId = 1,
    baseAddress =
    CommonModel.DEFAULT_BASE_ADDRESS,
  ): SunSpecModel {

    if (
      !Number.isInteger(baseAddress)
      || baseAddress < 0
      || baseAddress > 65467
    ) {
      throw new Error(
        `Invalid SunSpec base address: ${baseAddress}`,
      );
    }

    const modelStartAddress =
      baseAddress + 2;

    const dataStartAddress =
      modelStartAddress + 2;

    return SunSpecModelBuilder
      .create()
      .id(
        CommonModel.MODEL_ID,
      )
      .name(
        'Common',
      )
      .register(
        'manufacturer',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress,
          )
          .length(16)
          .dataType(
            RegisterDataType.String,
          )
          .name(
            'Manufacturer',
          )
          .build(),
      )
      .register(
        'model',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress + 16,
          )
          .length(16)
          .dataType(
            RegisterDataType.String,
          )
          .name(
            'Model',
          )
          .build(),
      )
      .register(
        'options',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress + 32,
          )
          .length(8)
          .dataType(
            RegisterDataType.String,
          )
          .name(
            'Options',
          )
          .build(),
      )
      .register(
        'version',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress + 40,
          )
          .length(8)
          .dataType(
            RegisterDataType.String,
          )
          .name(
            'Version',
          )
          .build(),
      )
      .register(
        'serialNumber',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress + 48,
          )
          .length(16)
          .dataType(
            RegisterDataType.String,
          )
          .name(
            'Serial Number',
          )
          .build(),
      )
      .register(
        'deviceAddress',
        RegisterDefinitionBuilder
          .create()
          .unitId(unitId)
          .holdingRegister()
          .address(
            dataStartAddress + 64,
          )
          .length(1)
          .dataType(
            RegisterDataType.Uint16,
          )
          .name(
            'Device Address',
          )
          .build(),
      )
      .build();

  }

}