/**
 * Defines the byte/word order of multi-register values.
 */
export enum RegisterByteOrder {
  /**
   * Standard Modbus order.
   *
   * Register 1 = High Word
   * Register 2 = Low Word
   */
  ABCD = 'ABCD',

  /**
   * Word swapped.
   */
  CDAB = 'CDAB',

  /**
   * Byte swapped inside each register.
   */
  BADC = 'BADC',

  /**
   * Complete byte reversal.
   */
  DCBA = 'DCBA',
}