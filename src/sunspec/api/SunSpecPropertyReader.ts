import type {
  SunSpecPropertyName,
  SunSpecPropertyValue,
} from '../SunSpecPropertyTypes.js';

/**
 * Provides typed access to logical SunSpec properties.
 *
 * Model-specific API classes depend on this interface instead
 * of depending directly on SunSpecDevice.
 */
export interface SunSpecPropertyReader {

  /**
   * Reads a typed logical SunSpec property.
   */
  read<
    TProperty extends SunSpecPropertyName,
  >(
    property: TProperty,
  ): Promise<
    SunSpecPropertyValue<TProperty>
  >;

}