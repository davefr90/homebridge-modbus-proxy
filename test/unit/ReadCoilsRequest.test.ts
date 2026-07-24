import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ReadCoilsRequest } from '../../src/client/requests/ReadCoilsRequest.js';

describe(
  'ReadCoilsRequest',
  () => {
    it(
      'creates a valid request',
      () => {
        const request =
          ReadCoilsRequest.create(
            1,
            123,
            8,
          );

        expect(
          request.unitId,
        ).toBe(1);

        expect(
          request.functionCode,
        ).toBe(
          ModbusFunctionCode.ReadCoils,
        );

        expect(
          request.data.readUInt16BE(0),
        ).toBe(123);

        expect(
          request.data.readUInt16BE(2),
        ).toBe(8);
      },
    );

    it(
      'creates exactly four data bytes',
      () => {
        const request =
          ReadCoilsRequest.create(
            1,
            0,
            1,
          );

        expect(
          request.data.length,
        ).toBe(4);
      },
    );
  },
);