import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { WriteMultipleCoilsRequest } from '../../src/client/requests/WriteMultipleCoilsRequest.js';

describe(
  'WriteMultipleCoilsRequest',
  () => {
    it(
      'creates a valid request',
      () => {
        const request =
          WriteMultipleCoilsRequest.create(
            1,
            100,
            [
              true,
              false,
              true,
              true,
              false,
              false,
              true,
              false,
              true,
            ],
          );

        expect(request.unitId).toBe(1);

        expect(request.functionCode).toBe(
          ModbusFunctionCode.WriteMultipleCoils,
        );

        expect(request.data.length).toBe(7);

        expect(request.data.readUInt16BE(0)).toBe(100);
        expect(request.data.readUInt16BE(2)).toBe(9);
        expect(request.data.readUInt8(4)).toBe(2);

        expect(request.data.readUInt8(5)).toBe(
          0b01001101,
        );

        expect(request.data.readUInt8(6)).toBe(
          0b00000001,
        );
      },
    );

    it(
      'throws if the coil list is empty',
      () => {
        expect(() =>
          WriteMultipleCoilsRequest.create(
            1,
            100,
            [],
          ),
        ).toThrow(RangeError);
      },
    );

    it(
      'throws if more than 1968 coils are supplied',
      () => {
        const values =
          new Array(1969).fill(
            false,
          );

        expect(() =>
          WriteMultipleCoilsRequest.create(
            1,
            100,
            values,
          ),
        ).toThrow(RangeError);
      },
    );

    it(
      'throws if a value is not boolean',
      () => {
        expect(() =>
          WriteMultipleCoilsRequest.create(
            1,
            100,
            [
              true,
              1 as unknown as boolean,
            ],
          ),
        ).toThrow(TypeError);
      },
    );

    it(
      'throws if the unit id is invalid',
      () => {
        expect(() =>
          WriteMultipleCoilsRequest.create(
            256,
            100,
            [true],
          ),
        ).toThrow(RangeError);
      },
    );

    it(
      'throws if the address is invalid',
      () => {
        expect(() =>
          WriteMultipleCoilsRequest.create(
            1,
            -1,
            [true],
          ),
        ).toThrow(RangeError);
      },
    );
  },
);