import type { RegisterDefinition } from './RegisterDefinition.js';

/**
 * Represents a complete Modbus register map for one device.
 */
export interface RegisterMap {

  /**
   * Human readable device name.
   */
  readonly name: string;

  /**
   * All registers exposed by the device.
   */
  readonly registers: readonly RegisterDefinition[];

}