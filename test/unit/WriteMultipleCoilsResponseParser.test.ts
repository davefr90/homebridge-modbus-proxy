import { describe, expect, it } from 'vitest';

import { ModbusProtocolError } from '../../src/exceptions/ModbusProtocolError.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { WriteMultipleCoilsResponseParser } from '../../src/client/responses/WriteMultipleCoilsResponseParser.js';

describe('WriteMultipleCoilsResponseParser', () => {
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
      ModbusFunctionCode.WriteMultipleCoils,
      data,
    );
  }

  it('accepts a valid response', () => {
    expect(() =>
      WriteMultipleCoilsResponseParser.parse(
        createFrame(100, 3),
        100,
        3,
      ),
    ).not.toThrow();
  });

  it('rejects an invalid address', () => {
    expect(() =>
      WriteMultipleCoilsResponseParser.parse(
        createFrame(101, 3),
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });

  it('rejects an invalid quantity', () => {
    expect(() =>
      WriteMultipleCoilsResponseParser.parse(
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
      ModbusFunctionCode.WriteMultipleCoils,
      Buffer.alloc(3),
    );

    expect(() =>
      WriteMultipleCoilsResponseParser.parse(
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
      ModbusFunctionCode.WriteSingleCoil,
      Buffer.alloc(4),
    );

    expect(() =>
      WriteMultipleCoilsResponseParser.parse(
        frame,
        100,
        3,
      ),
    ).toThrow(ModbusProtocolError);
  });
});