import { DeviceDefinition } from './DeviceDefinition.js';
import { DeviceDefinitionBuilder } from './DeviceDefinitionBuilder.js';

/**
 * Base class for SunSpec compatible devices.
 */
export abstract class SunSpecDeviceDefinition
  extends DeviceDefinition {

  protected constructor(
    builder: DeviceDefinitionBuilder,
  ) {

    const definition =
      builder.build();

    super(
      definition.info,
      definition.registerMap,
    );

  }

}