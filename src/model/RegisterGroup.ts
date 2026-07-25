import type { RegisterDefinition } from './RegisterDefinition.js';
import { PollFunction } from '../polling/PollFunction.js';

/**
 * Represents a contiguous group of Modbus registers
 * that can be read with one request.
 */
export interface RegisterGroup {

  /**
   * Modbus slave address.
   */
  readonly unitId: number;

  /**
   * Modbus read function.
   */
  readonly function: PollFunction;

  /**
   * First register address in the group.
   */
  readonly startAddress: number;

  /**
   * Total number of registers in the group.
   */
  readonly length: number;

  /**
   * Register definitions contained in this group.
   */
  readonly registers: readonly RegisterDefinition[];

}