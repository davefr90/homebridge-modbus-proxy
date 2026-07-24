import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { WriteSingleCoilResponseParser } from '../../src/client/responses/WriteSingleCoilResponseParser.js';

describe(
  'WriteSingleCoilResponseParser',
  () => {
    it(
      'accepts a valid response',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.WriteSingleCoil,
            Buffer.from([
              0x00,
              0x0a,
              0xff,
              0x00,
            ]),
          );

        expect(() =>
          WriteSingleCoilResponseParser.parse(
            frame,
            10,
            true,
          ),
        ).not.toThrow();
      },
    );

    it(
      'throws for an unexpected address',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.WriteSingleCoil,
            Buffer.from([
              0x00,
              0x0b,
              0xff,
              0x00,
            ]),
          );

        expect(() =>
          WriteSingleCoilResponseParser.parse(
            frame,
            10,
            true,
          ),
        ).toThrow();
      },
    );

    it(
      'throws for an unexpected value',
      () => {
        const frame =
          new ModbusTcpFrame(
            1,
            0,
            1,
            ModbusFunctionCode.WriteSingleCoil,
            Buffer.from([
              0x00,
              0x0a,
              0x00,
              0x00,
            ]),
          );

        expect(() =>
          WriteSingleCoilResponseParser.parse(
            frame,
            10,
            true,
          ),
        ).toThrow();
      },
    );
  },
);