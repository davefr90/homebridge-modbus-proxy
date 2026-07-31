import { RegisterByteOrder } from './RegisterByteOrder.js';

/**
 * Converts Modbus register arrays between supported register orders.
 */
export class RegisterOrderConverter {

  /**
   * Converts the supplied register values into the requested order.
   */
  public convert(
    values: Uint16Array,
    byteOrder: RegisterByteOrder =
    RegisterByteOrder.ABCD,
  ): Uint16Array {

    switch (byteOrder) {

    case RegisterByteOrder.ABCD:
      return values;

    case RegisterByteOrder.CDAB:
      return new Uint16Array([
        values[1],
        values[0],
      ]);

    case RegisterByteOrder.BADC:
      return new Uint16Array([
        this.swapBytes(values[0]),
        this.swapBytes(values[1]),
      ]);

    case RegisterByteOrder.DCBA:
      return new Uint16Array([
        this.swapBytes(values[1]),
        this.swapBytes(values[0]),
      ]);

    }

  }

  /**
   * Swaps the bytes inside one 16-bit register.
   */
  private swapBytes(
    value: number,
  ): number {

    return (
      ((value & 0xFF) << 8) |
      ((value >> 8) & 0xFF)
    );

  }

}