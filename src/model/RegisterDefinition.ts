import { PollFunction } from '../polling/PollFunction.js';
import { RegisterByteOrder } from './RegisterByteOrder.js';
import { RegisterDataType } from './RegisterDataType.js';

/**
 * Describes a Modbus register.
 */
export interface RegisterDefinition {

  /**
   * Modbus slave address.
   */
  unitId: number;

  /**
   * Poll function.
   */
  function: PollFunction;

  /**
   * Register start address.
   */
  address: number;

  /**
   * Number of Modbus registers.
   */
  length: number;

  /**
   * Register data type.
   */
  dataType: RegisterDataType;

  /**
   * Byte order for multi-register values.
   *
   * Default: ABCD
   */
  byteOrder?: RegisterByteOrder;

  /**
   * Poll interval in milliseconds.
   *
   * Undefined = use default interval.
   */
  pollIntervalMs?: number;

  /**
   * Scale factor.
   */
  scale?: number;

  /**
   * Whether the register can be written.
   */
  writable?: boolean;

  /**
   * Human readable register name.
   */
  name: string;

  /**
   * Optional engineering unit.
   */
  unit?: string;

}