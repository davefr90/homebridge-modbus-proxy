import { ModbusTcpFrame } from '../../protocol/ModbusTcpFrame.js';

/**
 * Parses Modbus Write Single Coil responses (Function Code 0x05).
 */
export class WriteSingleCoilResponseParser {
  /**
   * Validates the response returned by the server.
   *
   * @param frame Modbus response frame.
   * @param address Expected coil address.
   * @param value Expected coil value.
   */
  public static parse(
    frame: ModbusTcpFrame,
    address: number,
    value: boolean,
  ): void {
    const receivedAddress =
      frame.data.readUInt16BE(0);

    if (receivedAddress !== address) {
      throw new Error(
        `Expected coil address ${address} but received ${receivedAddress}.`,
      );
    }

    const receivedValue =
      frame.data.readUInt16BE(2);

    const expectedValue =
      value ? 0xff00 : 0x0000;

    if (receivedValue !== expectedValue) {
      throw new Error(
        `Expected coil value 0x${expectedValue.toString(16)} but received 0x${receivedValue.toString(16)}.`,
      );
    }
  }
}