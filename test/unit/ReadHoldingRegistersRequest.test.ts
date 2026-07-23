import { describe, expect, it } from 'vitest';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ReadHoldingRegistersRequest } from '../../src/client/requests/ReadHoldingRegistersRequest.js';

describe('ReadHoldingRegistersRequest', () => {
  it('creates a valid request', () => {
    const request = ReadHoldingRegistersRequest.create(
      1,
      100,
      10,
    );

    expect(request.unitId).toBe(1);
    expect(request.functionCode).toBe(
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    expect(request.data.length).toBe(4);
    expect(request.data.readUInt16BE(0)).toBe(100);
    expect(request.data.readUInt16BE(2)).toBe(10);
  });

  it('throws for an invalid unit id', () => {
    expect(() =>
      ReadHoldingRegistersRequest.create(
        256,
        100,
        10,
      ),
    ).toThrow(RangeError);
  });

  it('throws for an invalid address', () => {
    expect(() =>
      ReadHoldingRegistersRequest.create(
        1,
        -1,
        10,
      ),
    ).toThrow(RangeError);
  });

  it('throws for an invalid quantity', () => {
    expect(() =>
      ReadHoldingRegistersRequest.create(
        1,
        100,
        0,
      ),
    ).toThrow(RangeError);

    expect(() =>
      ReadHoldingRegistersRequest.create(
        1,
        100,
        126,
      ),
    ).toThrow(RangeError);
  });
});