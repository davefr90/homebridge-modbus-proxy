import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { ReadDiscreteInputsResponseParser } from '../../src/client/responses/ReadDiscreteInputsResponseParser.js';

describe(
  'ReadDiscreteInputsResponseParser',
  () => {
    it(
      'parses eight discrete inputs',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.ReadDiscreteInputs,
            Buffer.from([
              1,
              0b01001101,
            ]),
          );

        expect(
          ReadDiscreteInputsResponseParser.parse(
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
      'parses discrete inputs across byte boundaries',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.ReadDiscreteInputs,
            Buffer.from([
              2,
              0b11111111,
              0b00000001,
            ]),
          );

        expect(
          ReadDiscreteInputsResponseParser.parse(
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
            ModbusFunctionCode.ReadDiscreteInputs,
            Buffer.from([
              2,
              0,
            ]),
          );

        expect(() =>
          ReadDiscreteInputsResponseParser.parse(
            frame,
            1,
          ),
        ).toThrow();
      },
    );
  },
);