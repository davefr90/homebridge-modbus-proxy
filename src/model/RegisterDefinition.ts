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
   * Fixed scale factor.
   *
   * Example:
   * 0.1 converts a raw value of 2300 into 230.
   */
  scale?: number;

  /**
   * Logical property containing a dynamic base-10 scale factor.
   *
   * Example:
   * raw value 2300 and scale factor -1 produce 230.
   */
  scaleProperty?: string;

  /**
   * Decoded register value indicating that the SunSpec point
   * is not implemented.
   *
   * The value is checked before dynamic scaling is applied.
   */
  notImplementedValue?: number;

  /**
   * Whether the register can be written.
   */
  writable?: boolean;

  /**
   * Human-readable register name.
   */
  name: string;

  /**
   * Optional engineering unit.
   */
  unit?: string;

}
