/**
 * Describes a SunSpec model discovered on a Modbus device.
 */
export interface SunSpecDiscoveredModel {

  /**
   * SunSpec model identifier.
   */
  readonly id: number;

  /**
   * Address of the model-ID register.
   */
  readonly headerAddress: number;

  /**
   * Address of the first model data register.
   */
  readonly dataAddress: number;

  /**
   * Number of data registers in the model.
   *
   * The two model-header registers are not included.
   */
  readonly length: number;

}