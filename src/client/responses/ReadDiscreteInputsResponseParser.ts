import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';

/**
 * Parses Modbus Read Discrete Inputs responses (Function Code 0x02).
 */
export class ReadDiscreteInputsResponseParser {
  /**
   * Decodes the discrete input values from a Modbus response.
   *
   * @param frame Modbus TCP response frame.
   * @param quantity Number of requested discrete inputs.
   * @returns Decoded discrete input values.
   */
  public static parse(
    frame: ModbusTcpFrame,
    quantity: number,
  ): boolean[] {
    const byteCount =
      frame.data.readUInt8(0);

    const expectedByteCount =
      Math.ceil(quantity / 8);

    if (byteCount !== expectedByteCount) {
      throw new Error(
        `Expected ${expectedByteCount} data bytes but received ${byteCount}.`,
      );
    }

    const values: boolean[] = [];

    for (
      let index = 0;
      index < quantity;
      index++
    ) {
      const byte =
        frame.data.readUInt8(
          1 + Math.floor(index / 8),
        );

      const bit =
        (byte >> (index % 8)) & 0x01;

      values.push(
        bit === 1,
      );
    }

    return values;
  }
}