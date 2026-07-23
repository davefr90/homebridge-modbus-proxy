import { describe, expect, it } from 'vitest';

import { RegisterBank } from '../helpers/RegisterBank.js';

describe('RegisterBank', () => {
  it('writes and reads holding registers', () => {
    const bank = new RegisterBank();

    bank.writeHoldingRegisters(
      100,
      [
        10,
        20,
        30,
      ],
    );

    expect(
      bank.readHoldingRegisters(
        100,
        3,
      ),
    ).toEqual([
      10,
      20,
      30,
    ]);
  });

  it('writes and reads input registers', () => {
    const bank = new RegisterBank();

    bank.writeInputRegisters(
      200,
      [
        100,
        200,
        300,
      ],
    );

    expect(
      bank.readInputRegisters(
        200,
        3,
      ),
    ).toEqual([
      100,
      200,
      300,
    ]);
  });

  it('writes and reads a single holding register', () => {
    const bank = new RegisterBank();

    bank.writeHoldingRegister(
      500,
      12345,
    );

    expect(
      bank.readHoldingRegister(500),
    ).toBe(12345);
  });

  it('clears all registers', () => {
    const bank = new RegisterBank();

    bank.writeHoldingRegister(
      10,
      111,
    );

    bank.writeInputRegisters(
      20,
      [
        222,
        333,
      ],
    );

    bank.clear();

    expect(
      bank.readHoldingRegister(10),
    ).toBe(0);

    expect(
      bank.readInputRegisters(
        20,
        2,
      ),
    ).toEqual([
      0,
      0,
    ]);
  });

  it('throws when writing an invalid register value', () => {
    const bank = new RegisterBank();

    expect(() =>
      bank.writeHoldingRegister(
        0,
        70000,
      ),
    ).toThrow(RangeError);
  });

  it('throws when reading outside the register space', () => {
    const bank = new RegisterBank();

    expect(() =>
      bank.readHoldingRegisters(
        65535,
        2,
      ),
    ).toThrow(RangeError);
  });

  it('throws when writing outside the register space', () => {
    const bank = new RegisterBank();

    expect(() =>
      bank.writeHoldingRegisters(
        65535,
        [
          1,
          2,
        ],
      ),
    ).toThrow(RangeError);
  });

  it('throws for a negative address', () => {
    const bank = new RegisterBank();

    expect(() =>
      bank.readHoldingRegisters(
        -1,
        1,
      ),
    ).toThrow(RangeError);
  });

  it('throws for a quantity of zero', () => {
    const bank = new RegisterBank();

    expect(() =>
      bank.readHoldingRegisters(
        0,
        0,
      ),
    ).toThrow(RangeError);
  });
});