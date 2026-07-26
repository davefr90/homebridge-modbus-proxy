import { RegisterReader } from '../model/RegisterReader.js';
import { DeviceRegisterMap } from './DeviceRegisterMap.js';

/**
 * Reads logical device properties.
 */
export class DeviceReader {

  public constructor(
    private readonly registerMap: DeviceRegisterMap,
    private readonly registerReader: RegisterReader,
  ) {}

  /**
   * Reads a logical device property.
   */
  public async read(
    property: string,
  ): Promise<boolean | number | string> {

    const definition =
      this.registerMap.get(
        property,
      );

    const value =
      await this.registerReader.read(
        definition,
      );

    if (
      definition.scaleProperty === undefined
    ) {
      return value;
    }

    if (typeof value !== 'number') {
      throw new Error(
        `Dynamic scaling requires a numeric value: ${property}`,
      );
    }

    if (
      definition.scaleProperty === property
    ) {
      throw new Error(
        `Register cannot reference itself as scale property: ${property}`,
      );
    }

    const scaleDefinition =
      this.registerMap.get(
        definition.scaleProperty,
      );

    const scaleFactor =
      await this.registerReader.read(
        scaleDefinition,
      );

    if (typeof scaleFactor !== 'number') {
      throw new Error(
        `Scale property must contain a numeric value: ${definition.scaleProperty}`,
      );
    }

    return value * Math.pow(
      10,
      scaleFactor,
    );

  }

}