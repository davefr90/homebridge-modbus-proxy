import {
  DeviceRegisterMap,
} from '../../device/DeviceRegisterMap.js';

import {
  RegisterByteOrder,
} from '../../model/RegisterByteOrder.js';

import {
  RegisterDataType,
} from '../../model/RegisterDataType.js';

import type {
  RegisterDefinition,
} from '../../model/RegisterDefinition.js';

import {
  RegisterDefinitionBuilder,
} from '../../model/RegisterDefinitionBuilder.js';

import {
  SolarEdgeBatteryRegister,
} from './SolarEdgeBatteryRegister.js';

/**
 * Creates the proprietary SolarEdge battery status and
 * information register map.
 */
export class SolarEdgeBatteryModel {

  /**
   * Primary Battery 1 protocol base address.
   */
  public static readonly PRIMARY_BASE_ADDRESS =
    0xE100;

  /**
   * Documented mirror of the Battery 1 block.
   */
  public static readonly ALTERNATE_BASE_ADDRESS =
    0xF500;

  /**
   * SolarEdge Float32 value representing an unavailable point.
   */
  public static readonly NOT_IMPLEMENTED_FLOAT32 =
    -3.4028234663852886e+38;

  /**
   * Static identification and nameplate values use a separate
   * grouping interval so all live values remain in one request.
   */
  public static readonly STATIC_POLL_INTERVAL_MS =
    60000;

  /**
   * Creates the Battery 1 register map for one inverter unit.
   */
  public static create(
    unitId: number,
    baseAddress =
    SolarEdgeBatteryModel.PRIMARY_BASE_ADDRESS,
  ): DeviceRegisterMap {

    SolarEdgeBatteryModel.validateBaseAddress(
      baseAddress,
    );

    const registerMap =
      new DeviceRegisterMap();

    registerMap.add(
      'manufacturer',
      SolarEdgeBatteryModel.stringDefinition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MANUFACTURER,
        'Battery Manufacturer',
      ),
    );

    registerMap.add(
      'model',
      SolarEdgeBatteryModel.stringDefinition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MODEL,
        'Battery Model',
      ),
    );

    registerMap.add(
      'firmwareVersion',
      SolarEdgeBatteryModel.stringDefinition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.FIRMWARE_VERSION,
        'Battery Firmware Version',
      ),
    );

    registerMap.add(
      'serialNumber',
      SolarEdgeBatteryModel.stringDefinition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.SERIAL_NUMBER,
        'Battery Serial Number',
      ),
    );

    registerMap.add(
      'deviceId',
      SolarEdgeBatteryModel.uint16Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.DEVICE_ID,
        'Battery Device ID',
      ),
    );

    registerMap.add(
      'ratedEnergy',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.RATED_ENERGY,
        'Battery Rated Energy',
        'Wh',
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      ),
    );

    registerMap.add(
      'maximumChargeContinuousPower',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_CHARGE_CONTINUOUS_POWER,
        'Battery Maximum Continuous Charge Power',
        'W',
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      ),
    );

    registerMap.add(
      'maximumDischargeContinuousPower',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_DISCHARGE_CONTINUOUS_POWER,
        'Battery Maximum Continuous Discharge Power',
        'W',
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      ),
    );

    registerMap.add(
      'maximumChargePeakPower',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_CHARGE_PEAK_POWER,
        'Battery Maximum Peak Charge Power',
        'W',
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      ),
    );

    registerMap.add(
      'maximumDischargePeakPower',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_DISCHARGE_PEAK_POWER,
        'Battery Maximum Peak Discharge Power',
        'W',
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      ),
    );

    registerMap.add(
      'averageTemperature',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.AVERAGE_TEMPERATURE,
        'Battery Average Temperature',
        '°C',
      ),
    );

    registerMap.add(
      'maximumTemperature',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_TEMPERATURE,
        'Battery Maximum Temperature',
        '°C',
      ),
    );

    registerMap.add(
      'voltage',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.VOLTAGE,
        'Battery Voltage',
        'V',
      ),
    );

    registerMap.add(
      'current',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.CURRENT,
        'Battery Current',
        'A',
      ),
    );

    registerMap.add(
      'power',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.POWER,
        'Battery Power',
        'W',
      ),
    );

    registerMap.add(
      'maximumEnergy',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.MAXIMUM_ENERGY,
        'Battery Maximum Energy',
        'Wh',
      ),
    );

    registerMap.add(
      'availableEnergy',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.AVAILABLE_ENERGY,
        'Battery Available Energy',
        'Wh',
      ),
    );

    registerMap.add(
      'stateOfHealth',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.STATE_OF_HEALTH,
        'Battery State of Health',
        '%',
      ),
    );

    registerMap.add(
      'stateOfEnergy',
      SolarEdgeBatteryModel.float32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.STATE_OF_ENERGY,
        'Battery State of Energy',
        '%',
      ),
    );

    registerMap.add(
      'status',
      SolarEdgeBatteryModel.uint32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.STATUS,
        'Battery Status',
      ),
    );

    registerMap.add(
      'statusInternal',
      SolarEdgeBatteryModel.uint32Definition(
        unitId,
        baseAddress
        + SolarEdgeBatteryRegister.STATUS_INTERNAL,
        'Battery Internal Status',
      ),
    );

    return registerMap;

  }

  /**
   * Creates a common holding-register definition builder.
   */
  private static definitionBuilder(
    unitId: number,
    address: number,
  ): RegisterDefinitionBuilder {

    return RegisterDefinitionBuilder
      .create()
      .unitId(
        unitId,
      )
      .holdingRegister()
      .address(
        address,
      );

  }

  /**
   * Creates a SolarEdge String[32] definition.
   */
  private static stringDefinition(
    unitId: number,
    address: number,
    name: string,
  ): RegisterDefinition {

    return SolarEdgeBatteryModel
      .definitionBuilder(
        unitId,
        address,
      )
      .length(
        16,
      )
      .dataType(
        RegisterDataType.String,
      )
      .pollIntervalMs(
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      )
      .name(
        name,
      )
      .build();

  }

  /**
   * Creates a SolarEdge Uint16 definition.
   */
  private static uint16Definition(
    unitId: number,
    address: number,
    name: string,
  ): RegisterDefinition {

    return SolarEdgeBatteryModel
      .definitionBuilder(
        unitId,
        address,
      )
      .length(
        1,
      )
      .dataType(
        RegisterDataType.Uint16,
      )
      .pollIntervalMs(
        SolarEdgeBatteryModel.STATIC_POLL_INTERVAL_MS,
      )
      .notImplementedValue(
        0xFFFF,
      )
      .name(
        name,
      )
      .build();

  }

  /**
   * Creates a word-swapped SolarEdge Float32 definition.
   */
  private static float32Definition(
    unitId: number,
    address: number,
    name: string,
    unit: string,
    pollIntervalMs?: number,
  ): RegisterDefinition {

    const builder =
      SolarEdgeBatteryModel
        .definitionBuilder(
          unitId,
          address,
        );

    if (pollIntervalMs !== undefined) {
      builder.pollIntervalMs(
        pollIntervalMs,
      );
    }

    return builder
      .length(
        2,
      )
      .dataType(
        RegisterDataType.Float32,
      )
      .byteOrder(
        RegisterByteOrder.CDAB,
      )
      .notImplementedValue(
        SolarEdgeBatteryModel.NOT_IMPLEMENTED_FLOAT32,
      )
      .name(
        name,
      )
      .unit(
        unit,
      )
      .build();

  }

  /**
   * Creates a word-swapped SolarEdge Uint32 definition.
   */
  private static uint32Definition(
    unitId: number,
    address: number,
    name: string,
  ): RegisterDefinition {

    return SolarEdgeBatteryModel
      .definitionBuilder(
        unitId,
        address,
      )
      .length(
        2,
      )
      .dataType(
        RegisterDataType.Uint32,
      )
      .byteOrder(
        RegisterByteOrder.CDAB,
      )
      .notImplementedValue(
        0xFFFFFFFF,
      )
      .name(
        name,
      )
      .build();

  }

  /**
   * Validates a battery block base address.
   */
  private static validateBaseAddress(
    baseAddress: number,
  ): void {

    const maximumBaseAddress =
      65536
      - SolarEdgeBatteryRegister.STATUS_INTERNAL
      - 2;

    if (
      !Number.isInteger(
        baseAddress,
      )
      || baseAddress < 0
      || baseAddress > maximumBaseAddress
    ) {
      throw new Error(
        `Invalid SolarEdge battery base address: ${baseAddress}`,
      );
    }

  }

}
