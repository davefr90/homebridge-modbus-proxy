import { describe, expect, it } from 'vitest';

import { ReadHoldingRegistersResponseParser } from '../../src/client/responses/ReadHoldingRegistersResponseParser.js';
import { ModbusProtocolError } from '../../src/exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';

describe('ReadHoldingRegistersResponseParser', () => {
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
      ModbusFunctionCode.ReadHoldingRegisters,
      data,
    );
  }

  it('parses a valid response', () => {
    expect(
      ReadHoldingRegistersResponseParser.parse(
        createFrame([
          10,
          20,
          30,
        ]),
        3,
      ),
    ).toEqual([
      10,
      20,
      30,
    ]);
  });

  it('rejects an invalid byte count', () => {
    const frame = new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.ReadHoldingRegisters,
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
      ReadHoldingRegistersResponseParser.parse(
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
        ModbusFunctionCode.ReadInputRegisters,
        validFrame.data,
      );

    expect(() =>
      ReadHoldingRegistersResponseParser.parse(
        frameWithInvalidFunctionCode,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });
});