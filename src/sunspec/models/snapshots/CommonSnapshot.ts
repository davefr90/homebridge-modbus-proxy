/**
 * Immutable snapshot of the SunSpec Common Model.
 */
export interface CommonSnapshot {

  /**
   * Device manufacturer.
   */
  readonly manufacturer: string;

  /**
   * Device model.
   */
  readonly model: string;

  /**
   * Manufacturer-specific options.
   */
  readonly options: string;

  /**
   * Firmware or software version.
   */
  readonly version: string;

  /**
   * Device serial number.
   */
  readonly serialNumber: string;

  /**
   * Modbus device address.
   */
  readonly deviceAddress: number;

}