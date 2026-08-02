import type {
  SunSpecPropertyName,
  SunSpecPropertyValue,
} from '../SunSpecPropertyTypes.js';

/**
 * Typed values returned for a collection of SunSpec
 * properties.
 */
export type SunSpecPropertyValues<
  TProperties extends readonly SunSpecPropertyName[],
> = {

  readonly [
    TProperty in TProperties[number]
  ]:
    SunSpecPropertyValue<TProperty>;

};

/**
 * Provides access to logical SunSpec properties.
 *
 * Model-specific API classes depend on this interface instead
 * of depending directly on SunSpecDevice.
 */
export interface SunSpecPropertyReader {

  /**
   * Reads a typed logical SunSpec property.
   *
   * The return type is inferred from the supplied property.
   */
  read<
    TProperty extends SunSpecPropertyName,
  >(
    property: TProperty,
  ): Promise<
    SunSpecPropertyValue<TProperty>
  >;

  /**
   * Reads multiple typed logical SunSpec properties using
   * optimized contiguous Modbus block requests.
   */
  readMany<
    TProperties extends readonly SunSpecPropertyName[],
  >(
    properties: TProperties,
  ): Promise<
    SunSpecPropertyValues<TProperties>
  >;

  /**
   * Writes a logical SunSpec property.
   *
   * Writable property typing will be introduced separately.
   */
  write(
    property: string,
    value: boolean | number | string,
  ): Promise<void>;

}
