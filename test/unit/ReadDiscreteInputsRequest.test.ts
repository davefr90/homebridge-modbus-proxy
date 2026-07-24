import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ReadDiscreteInputsRequest } from '../../src/client/requests/ReadDiscreteInputsRequest.js';

describe(
  'ReadDiscreteInputsRequest',
  () => {
    it(
      'creates a valid request',
      () => {
        const request =
          ReadDiscreteInputsRequest.create(
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
          ModbusFunctionCode.ReadDiscreteInputs,
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
          ReadDiscreteInputsRequest.create(
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