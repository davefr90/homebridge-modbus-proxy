import type {
  SunSpecPropertyName,
  SunSpecPropertyValue,
} from '../SunSpecPropertyTypes.js';

import type {
  SunSpecPropertyReader,
} from './SunSpecPropertyReader.js';

/**
 * Base class for model-specific SunSpec APIs.
 *
 * Provides shared typed property access while keeping
 * individual model APIs focused on their own properties.
 */
export abstract class PropertyApi {

  /**
   * Creates a new model-specific property API.
   *
   * @param propertyReader Logical SunSpec property reader.
   */
  protected constructor(

    private readonly propertyReader:
      SunSpecPropertyReader,

  ) {
  }

  /**
   * Reads a typed logical SunSpec property.
   *
   * The return type is inferred from the supplied property.
   */
  protected read<
    TProperty extends SunSpecPropertyName,
  >(
    property: TProperty,
  ): Promise<
    SunSpecPropertyValue<TProperty>
  > {

    return this.propertyReader.read(
      property,
    );

  }

  /**
   * Writes a logical SunSpec property.
   *
   * Writable property typing will be introduced separately,
   * so read-only properties cannot accidentally be exposed
   * as writable through the public model APIs.
   */
  protected write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    return this.propertyReader.write(
      property,
      value,
    );

  }

}