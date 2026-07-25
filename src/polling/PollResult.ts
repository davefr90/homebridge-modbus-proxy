/**
 * Result of a completed Modbus polling operation.
 */
export interface PollResult {
  /**
   * Modbus unit identifier.
   */
  unitId: number;

  /**
   * Modbus function code.
   */
  functionCode: number;

  /**
   * First register address.
   */
  startAddress: number;

  /**
   * Number of registers.
   */
  quantity: number;

  /**
   * Register values.
   */
  values: Uint16Array;

  /**
   * Time when polling started.
   */
  startedAt: Date;

  /**
   * Time when polling completed.
   */
  completedAt: Date;

  /**
   * Poll duration in milliseconds.
   */
  durationMs: number;
}