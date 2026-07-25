import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterByteOrder } from '../../src/model/RegisterByteOrder.js';
import { RegisterOrderConverter } from '../../src/model/RegisterOrderConverter.js';

describe(
  'RegisterOrderConverter',
  () => {

    const converter =
      new RegisterOrderConverter();

    it(
      'keeps ABCD order',
      () => {

        expect(
          converter.convert(
            new Uint16Array([
              0x1122,
              0x3344,
            ]),
            RegisterByteOrder.ABCD,
          ),
        ).toEqual(
          new Uint16Array([
            0x1122,
            0x3344,
          ]),
        );

      },
    );

    it(
      'converts CDAB order',
      () => {

        expect(
          converter.convert(
            new Uint16Array([
              0x1122,
              0x3344,
            ]),
            RegisterByteOrder.CDAB,
          ),
        ).toEqual(
          new Uint16Array([
            0x3344,
            0x1122,
          ]),
        );

      },
    );

    it(
      'converts BADC order',
      () => {

        expect(
          converter.convert(
            new Uint16Array([
              0x1122,
              0x3344,
            ]),
            RegisterByteOrder.BADC,
          ),
        ).toEqual(
          new Uint16Array([
            0x2211,
            0x4433,
          ]),
        );

      },
    );

    it(
      'converts DCBA order',
      () => {

        expect(
          converter.convert(
            new Uint16Array([
              0x1122,
              0x3344,
            ]),
            RegisterByteOrder.DCBA,
          ),
        ).toEqual(
          new Uint16Array([
            0x4433,
            0x2211,
          ]),
        );

      },
    );

  },
);