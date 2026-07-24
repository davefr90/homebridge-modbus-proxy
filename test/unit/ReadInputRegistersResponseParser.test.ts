import { describe, expect, it } from 'vitest';

import { ReadInputRegistersResponseParser } from '../../src/client/responses/ReadInputRegistersResponseParser.js';
import { ModbusProtocolError } from '../../src/exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';

describe('ReadInputRegistersResponseParser', () => {
  function createFrame(values: number[]): ModbusTcpFrame {
    const data = Buffer.alloc(
      1 + (values.length * 2),
    );

    data.writeUInt8(
      values.length * 2,
      0,
    );

    values.forEach((value, index) => {
      data.writeUInt16BE(
        value,
        1 + (index * 2),
      );
    });

    return new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.ReadInputRegisters,
      data,
    );
  }

  it('parses a valid response', () => {
    expect(
      ReadInputRegistersResponseParser.parse(
        createFrame([
          100,
          200,
          300,
        ]),
        3,
      ),
    ).toEqual([
      100,
      200,
      300,
    ]);
  });

  it('rejects an invalid byte count', () => {
    const frame = new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.ReadInputRegisters,
      Buffer.from([
        4,
        0,
        1,
        0,
        2,
        0,
        3,
      ]),
    );

    expect(() =>
      ReadInputRegistersResponseParser.parse(
        frame,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid function code', () => {
    const validFrame = createFrame([
      1,
      2,
      3,
    ]);

    const frameWithInvalidFunctionCode =
      new ModbusTcpFrame(
        validFrame.transactionId,
        validFrame.protocolId,
        validFrame.unitId,
        ModbusFunctionCode.ReadHoldingRegisters,
        validFrame.data,
      );

    expect(() =>
      ReadInputRegistersResponseParser.parse(
        frameWithInvalidFunctionCode,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });
});