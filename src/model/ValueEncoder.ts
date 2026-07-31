import { RegisterByteOrder } from './RegisterByteOrder.js';
import type { RegisterDefinition } from './RegisterDefinition.js';
import { RegisterDataType } from './RegisterDataType.js';
import { RegisterOrderConverter } from './RegisterOrderConverter.js';

/**
 * Encodes application values into Modbus register values.
 */
export class ValueEncoder {

  private readonly wordOrderConverter =
    new RegisterOrderConverter();

  /**
   * Encodes a value into one or more Modbus registers.
   */
  public encode(
    definition: RegisterDefinition,
    value: boolean | number | string,
  ): Uint16Array {

    const encodedValues =
      this.encodeValue(
        definition,
        value,
      );

    if (encodedValues.length < 2) {
      return encodedValues;
    }

    return this.wordOrderConverter.convert(
      encodedValues,
      definition.byteOrder ??
        RegisterByteOrder.ABCD,
    );

  }

  /**
   * Encodes a value in standard ABCD register order.
   */
  private encodeValue(
    definition: RegisterDefinition,
    value: boolean | number | string,
  ): Uint16Array {

    switch (definition.dataType) {

    case RegisterDataType.Boolean:
      return new Uint16Array([
        value ? 1 : 0,
      ]);

    case RegisterDataType.Uint16:
      return new Uint16Array([
        Number(value),
      ]);

    case RegisterDataType.Int16:
      return new Uint16Array([
        Number(value) & 0xFFFF,
      ]);

    case RegisterDataType.Uint32: {

      const number =
          Number(value);

      return new Uint16Array([
        (number >>> 16) & 0xFFFF,
        number & 0xFFFF,
      ]);

    }

    case RegisterDataType.Int32: {

      const number =
          Number(value);

      return new Uint16Array([
        (number >> 16) & 0xFFFF,
        number & 0xFFFF,
      ]);

    }

    case RegisterDataType.Float32: {

      const buffer =
          new ArrayBuffer(4);

      const view =
          new DataView(buffer);

      view.setFloat32(
        0,
        Number(value),
        false,
      );

      return new Uint16Array([
        view.getUint16(
          0,
          false,
        ),
        view.getUint16(
          2,
          false,
        ),
      ]);

    }

    case RegisterDataType.String: {

      const text =
    String(value);

      const registers =
    new Uint16Array(definition.length);

      let registerIndex =
    0;

      for (
        let i = 0;
        i < text.length &&
    registerIndex < registers.length;
        i += 2
      ) {

        const high =
      text.charCodeAt(i);

        const low =
      i + 1 < text.length
        ? text.charCodeAt(i + 1)
        : 0;

        registers[registerIndex++] =
      ((high & 0xFF) << 8) |
      (low & 0xFF);

      }

      return registers;

    }

    default:
      throw new Error(
        `Unsupported data type: ${definition.dataType}`,
      );

    }

  }

}