import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterByteOrder } from '../../src/model/RegisterByteOrder.js';

describe(
  'RegisterByteOrder',
  () => {
    it(
      'contains all supported byte orders',
      () => {
        expect(
          Object.values(
            RegisterByteOrder,
          ),
        ).toEqual([
          'ABCD',
          'CDAB',
          'BADC',
          'DCBA',
        ]);
      },
    );
  },
);