import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { CoilBank } from '../helpers/CoilBank.js';

describe(
  'CoilBank',
  () => {
    let bank: CoilBank;

    beforeEach(() => {
      bank = new CoilBank();
    });

    it(
      'returns false for unknown coils',
      () => {
        expect(
          bank.readCoil(0),
        ).toBe(false);
      },
    );

    it(
      'stores a coil',
      () => {
        bank.writeCoil(
          10,
          true,
        );

        expect(
          bank.readCoil(10),
        ).toBe(true);
      },
    );

    it(
      'overwrites a coil',
      () => {
        bank.writeCoil(
          5,
          true,
        );

        bank.writeCoil(
          5,
          false,
        );

        expect(
          bank.readCoil(5),
        ).toBe(false);
      },
    );

    it(
      'clears all coils',
      () => {
        bank.writeCoil(
          1,
          true,
        );

        bank.clear();

        expect(
          bank.readCoil(1),
        ).toBe(false);
      },
    );
  },
);