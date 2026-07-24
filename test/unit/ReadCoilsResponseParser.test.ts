import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { ReadCoilsResponseParser } from '../../src/client/responses/ReadCoilsResponseParser.js';

describe(
  'ReadCoilsResponseParser',
  () => {
    it(
      'parses eight coils',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.ReadCoils,
            Buffer.from([
              1,
              0b01001101,
            ]),
          );

        expect(
          ReadCoilsResponseParser.parse(
            frame,
            8,
          ),
        ).toEqual([
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
        ]);
      },
    );

    it(
      'parses coils across byte boundaries',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.ReadCoils,
            Buffer.from([
              2,
              0b11111111,
              0b00000001,
            ]),
          );

        expect(
          ReadCoilsResponseParser.parse(
            frame,
            9,
          ),
        ).toEqual([
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ]);
      },
    );

    it(
      'throws for invalid byte count',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.ReadCoils,
            Buffer.from([
              2,
              0,
            ]),
          );

        expect(() =>
          ReadCoilsResponseParser.parse(
            frame,
            1,
          ),
        ).toThrow();
      },
    );
  },
);