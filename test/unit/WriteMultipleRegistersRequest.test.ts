import { describe, expect, it } from 'vitest';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { WriteMultipleRegistersRequest } from '../../src/client/requests/WriteMultipleRegistersRequest.js';

describe('WriteMultipleRegistersRequest', () => {
  it('creates a valid request', () => {
    const request = WriteMultipleRegistersRequest.create(
      1,
      100,
      [
        0x1234,
        0xabcd,
        0x5678,
      ],
    );

    expect(request.unitId).toBe(1);
    expect(request.functionCode).toBe(
      ModbusFunctionCode.WriteMultipleRegisters,
    );

    expect(request.data.length).toBe(11);

    expect(request.data.readUInt16BE(0)).toBe(100);
    expect(request.data.readUInt16BE(2)).toBe(3);
    expect(request.data.readUInt8(4)).toBe(6);

    expect(request.data.readUInt16BE(5)).toBe(0x1234);
    expect(request.data.readUInt16BE(7)).toBe(0xabcd);
    expect(request.data.readUInt16BE(9)).toBe(0x5678);
  });

  it('throws if the register list is empty', () => {
    expect(() =>
      WriteMultipleRegistersRequest.create(
        1,
        100,
        [],
      ),
    ).toThrow(RangeError);
  });

  it('throws if more than 123 registers are supplied', () => {
    const values = new Array(124).fill(0);

    expect(() =>
      WriteMultipleRegistersRequest.create(
        1,
        100,
        values,
      ),
    ).toThrow(RangeError);
  });

  it('throws if a register value is outside the valid range', () => {
    expect(() =>
      WriteMultipleRegistersRequest.create(
        1,
        100,
        [
          1,
          70000,
        ],
      ),
    ).toThrow(RangeError);
  });

  it('throws if the unit id is invalid', () => {
    expect(() =>
      WriteMultipleRegistersRequest.create(
        256,
        100,
        [1],
      ),
    ).toThrow(RangeError);
  });

  it('throws if the address is invalid', () => {
    expect(() =>
      WriteMultipleRegistersRequest.create(
        1,
        -1,
        [1],
      ),
    ).toThrow(RangeError);
  });
});