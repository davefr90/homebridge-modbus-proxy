import { describe, expect, it } from 'vitest';

import { ModbusProtocolError } from '../../src/exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { WriteMultipleRegistersResponseParser } from '../../src/client/responses/WriteMultipleRegistersResponseParser.js';

describe('WriteMultipleRegistersResponseParser', () => {
  function createFrame(
    address: number,
    quantity: number,
  ): ModbusTcpFrame {
    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(quantity, 2);

    return new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.WriteMultipleRegisters,
      data,
    );
  }

  it('accepts a valid response', () => {
    expect(() =>
      WriteMultipleRegistersResponseParser.parse(
        createFrame(100, 3),
        100,
        3,
      ),
    ).not.toThrow();
  });

  it('rejects an invalid address', () => {
    expect(() =>
      WriteMultipleRegistersResponseParser.parse(
        createFrame(101, 3),
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid quantity', () => {
    expect(() =>
      WriteMultipleRegistersResponseParser.parse(
        createFrame(100, 4),
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid payload length', () => {
    const frame = new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.WriteMultipleRegisters,
      Buffer.alloc(3),
    );

    expect(() =>
      WriteMultipleRegistersResponseParser.parse(
        frame,
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid function code', () => {
    const frame = new ModbusTcpFrame(
      1,
      0,
      1,
      ModbusFunctionCode.WriteSingleRegister,
      Buffer.alloc(4),
    );

    expect(() =>
      WriteMultipleRegistersResponseParser.parse(
        frame,
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });
});