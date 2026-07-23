import { describe, expect, it } from 'vitest';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { WriteSingleRegisterRequest } from '../../src/client/requests/WriteSingleRegisterRequest.js';

describe('WriteSingleRegisterRequest', () => {
  it('creates a valid request', () => {
    const request = WriteSingleRegisterRequest.create(
      1,
      123,
      0x4321,
    );

    expect(request.unitId).toBe(1);
    expect(request.functionCode).toBe(
      ModbusFunctionCode.WriteSingleRegister,
    );

    expect(request.data.length).toBe(4);
    expect(request.data.readUInt16BE(0)).toBe(123);
    expect(request.data.readUInt16BE(2)).toBe(0x4321);
  });

  it('throws for an invalid value', () => {
    expect(() =>
      WriteSingleRegisterRequest.create(
        1,
        100,
        70000,
      ),
    ).toThrow(RangeError);
  });

  it('throws for an invalid address', () => {
    expect(() =>
      WriteSingleRegisterRequest.create(
        1,
        -1,
        1,
      ),
    ).toThrow(RangeError);
  });
});