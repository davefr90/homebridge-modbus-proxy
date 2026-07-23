import { describe, expect, it } from 'vitest';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ReadInputRegistersRequest } from '../../src/client/requests/ReadInputRegistersRequest.js';

describe('ReadInputRegistersRequest', () => {
  it('creates a valid request', () => {
    const request = ReadInputRegistersRequest.create(
      1,
      250,
      5,
    );

    expect(request.unitId).toBe(1);
    expect(request.functionCode).toBe(
      ModbusFunctionCode.ReadInputRegisters,
    );

    expect(request.data.readUInt16BE(0)).toBe(250);
    expect(request.data.readUInt16BE(2)).toBe(5);
  });

  it('throws for an invalid quantity', () => {
    expect(() =>
      ReadInputRegistersRequest.create(
        1,
        0,
        0,
      ),
    ).toThrow(RangeError);

    expect(() =>
      ReadInputRegistersRequest.create(
        1,
        0,
        126,
      ),
    ).toThrow(RangeError);
  });
});