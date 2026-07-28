import { DeviceRegisterMap } from '../device/DeviceRegisterMap.js';

/**
 * Represents a single SunSpec model.
 *
 * Examples:
 *  - Model 1   (Common)
 *  - Model 120 (Inverter)
 *  - Model 160 (Meter)
 *  - Model 802 (Battery)
 */
export class SunSpecModel {

  /**
   * Creates a new SunSpec model.
   */
  public constructor(

    /**
     * SunSpec model identifier.
     */
    public readonly id: number,

    /**
     * Human readable model name.
     */
    public readonly name: string,

    /**
     * Register map belonging to this model.
     */
    public readonly registerMap: DeviceRegisterMap,

  ) {

    if (!Number.isInteger(id) || id < 1) {
      throw new Error(
        `Invalid SunSpec model id: ${id}`,
      );
    }

    if (name.trim() === '') {
      throw new Error(
        'SunSpec model name must not be empty.',
      );
    }

  }

}