import { describe, expect, it } from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { WriteSingleRegisterResponseParser } from '../../src/client/responses/WriteSingleRegisterResponseParser.js';
import { ModbusProtocolError } from '../../src/exceptions/ModbusProtocolError.js';

describe('WriteSingleRegisterResponseParser', () => {
  function createFrame(
    address: number,
    value: number,
  ): ModbusTcpFrame {
    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(value, 2);

    return new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.WriteSingleRegister,
      data,
    );
  }

  it('accepts a valid response', () => {
    expect(() =>
      WriteSingleRegisterResponseParser.parse(
        createFrame(100, 1234),
        100,
        1234,
      ),
    ).not.toThrow();
  });

  it('rejects an invalid address', () => {
    expect(() =>
      WriteSingleRegisterResponseParser.parse(
        createFrame(101, 1234),
        100,
        1234,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid value', () => {
    expect(() =>
      WriteSingleRegisterResponseParser.parse(
        createFrame(100, 999),
        100,
        1234,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid payload length', () => {
    const frame = new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.WriteSingleRegister,
      Buffer.alloc(3),
    );

    expect(() =>
      WriteSingleRegisterResponseParser.parse(
        frame,
        100,
        1234,
      ),
    ).toThrow(ModbusProtocolError);
  });
});