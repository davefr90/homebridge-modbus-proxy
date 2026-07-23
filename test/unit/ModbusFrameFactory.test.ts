import { describe, expect, it } from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusFrameFactory } from '../helpers/ModbusFrameFactory.js';

describe('ModbusFrameFactory', () => {
  it('creates a Read Holding Registers response', () => {
    const frame =
      ModbusFrameFactory.createReadHoldingRegistersResponse(
        123,
        1,
        [
          10,
          20,
          30,
        ],
      );

    expect(frame.transactionId).toBe(123);
    expect(frame.protocolId).toBe(0);
    expect(frame.unitId).toBe(1);
    expect(frame.functionCode).toBe(
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    expect(frame.data.readUInt8(0)).toBe(6);
    expect(frame.data.readUInt16BE(1)).toBe(10);
    expect(frame.data.readUInt16BE(3)).toBe(20);
    expect(frame.data.readUInt16BE(5)).toBe(30);
  });

  it('creates a Read Input Registers response', () => {
    const frame =
      ModbusFrameFactory.createReadInputRegistersResponse(
        55,
        2,
        [
          100,
          200,
        ],
      );

    expect(frame.transactionId).toBe(55);
    expect(frame.unitId).toBe(2);
    expect(frame.functionCode).toBe(
      ModbusFunctionCode.ReadInputRegisters,
    );

    expect(frame.data.readUInt8(0)).toBe(4);
    expect(frame.data.readUInt16BE(1)).toBe(100);
    expect(frame.data.readUInt16BE(3)).toBe(200);
  });

  it('creates a Write Single Register response', () => {
    const frame =
      ModbusFrameFactory.createWriteSingleRegisterResponse(
        10,
        1,
        500,
        12345,
      );

    expect(frame.functionCode).toBe(
      ModbusFunctionCode.WriteSingleRegister,
    );

    expect(frame.data.readUInt16BE(0)).toBe(500);
    expect(frame.data.readUInt16BE(2)).toBe(12345);
  });

  it('creates a Write Multiple Registers response', () => {
    const frame =
      ModbusFrameFactory.createWriteMultipleRegistersResponse(
        99,
        1,
        1000,
        8,
      );

    expect(frame.functionCode).toBe(
      ModbusFunctionCode.WriteMultipleRegisters,
    );

    expect(frame.data.readUInt16BE(0)).toBe(1000);
    expect(frame.data.readUInt16BE(2)).toBe(8);
  });

  it('creates the correct byte count for one register', () => {
    const frame =
      ModbusFrameFactory.createReadHoldingRegistersResponse(
        1,
        1,
        [123],
      );

    expect(frame.data.readUInt8(0)).toBe(2);
    expect(frame.data.length).toBe(3);
  });

  it('creates the correct byte count for ten registers', () => {
    const values = Array.from(
      { length: 10 },
      (_, index) => index,
    );

    const frame =
      ModbusFrameFactory.createReadHoldingRegistersResponse(
        1,
        1,
        values,
      );

    expect(frame.data.readUInt8(0)).toBe(20);
    expect(frame.data.length).toBe(21);
  });

  it('preserves the transaction identifier', () => {
    const frame =
      ModbusFrameFactory.createWriteSingleRegisterResponse(
        65535,
        17,
        1,
        2,
      );

    expect(frame.transactionId).toBe(65535);
    expect(frame.unitId).toBe(17);
  });
});