import { RegisterByteOrder } from './RegisterByteOrder.js';
import type { RegisterDefinition } from './RegisterDefinition.js';
import { RegisterDataType } from './RegisterDataType.js';
import { RegisterOrderConverter } from './RegisterOrderConverter.js';

/**
 * Converts raw Modbus register values into application values.
 */
export class ValueConverter {

  private readonly wordOrderConverter =
    new RegisterOrderConverter();

  public convert(
    definition: RegisterDefinition,
    values: Uint16Array,
  ): boolean | number | string {

    if (
      definition.dataType ===
      RegisterDataType.String
    ) {
      return this.convertString(values);
    }

    const orderedValues =
      this.getOrderedValues(
        definition,
        values,
      );

    let result: boolean | number;

    switch (definition.dataType) {

    case RegisterDataType.Boolean:
      result =
          orderedValues[0] !== 0;
      break;

    case RegisterDataType.Uint16:
      result =
          orderedValues[0];
      break;

    case RegisterDataType.Int16:
      result =
          (orderedValues[0] << 16) >> 16;
      break;

    case RegisterDataType.Uint32:
      result =
          orderedValues[0] * 65536 +
          orderedValues[1];
      break;

    case RegisterDataType.Int32: {

      const value =
          orderedValues[0] * 65536 +
          orderedValues[1];

      result =
          value > 0x7FFFFFFF
            ? value - 0x100000000
            : value;

      break;
    }

    case RegisterDataType.Float32: {

      const buffer =
          new ArrayBuffer(4);

      const view =
          new DataView(buffer);

      view.setUint16(
        0,
        orderedValues[0],
        false,
      );

      view.setUint16(
        2,
        orderedValues[1],
        false,
      );

      result =
          view.getFloat32(
            0,
            false,
          );

      break;
    }

    default:
      throw new Error(
        `Unsupported data type: ${definition.dataType}`,
      );

    }

    if (
      typeof result === 'number' &&
      definition.scale !== undefined
    ) {
      return result * definition.scale;
    }

    return result;

  }

  /**
   * Converts Modbus register values into a UTF-8 string.
   *
   * Each register contains two bytes in high-byte/low-byte order.
   * Conversion stops at the first null byte.
   */
  private convertString(
    values: Uint16Array,
  ): string {

    const bytes: number[] =
      [];

    for (const value of values) {

      const highByte =
        (value >> 8) & 0xFF;

      const lowByte =
        value & 0xFF;

      if (highByte === 0) {
        break;
      }

      bytes.push(highByte);

      if (lowByte === 0) {
        break;
      }

      bytes.push(lowByte);

    }

    return new TextDecoder(
      'utf-8',
    ).decode(
      new Uint8Array(bytes),
    );

  }

  /**
   * Applies the configured byte order to multi-register numeric values.
   */
  private getOrderedValues(
    definition: RegisterDefinition,
    values: Uint16Array,
  ): Uint16Array {

    if (values.length < 2) {
      return values;
    }

    return this.wordOrderConverter.convert(
      values,
      definition.byteOrder ??
        RegisterByteOrder.ABCD,
    );

  }

}