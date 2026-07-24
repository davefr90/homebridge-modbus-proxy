import {
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { WriteSingleCoilRequest } from '../../src/client/requests/WriteSingleCoilRequest.js';

describe(
  'WriteSingleCoilRequest',
  () => {
    it(
      'creates a request for true',
      () => {
        const request =
          WriteSingleCoilRequest.create(
            1,
            15,
            true,
          );

        expect(
          request.unitId,
        ).toBe(1);

        expect(
          request.functionCode,
        ).toBe(
          ModbusFunctionCode.WriteSingleCoil,
        );

        expect(
          request.data.readUInt16BE(0),
        ).toBe(15);

        expect(
          request.data.readUInt16BE(2),
        ).toBe(0xff00);
      },
    );

    it(
      'creates a request for false',
      () => {
        const request =
          WriteSingleCoilRequest.create(
            1,
            15,
            false,
          );

        expect(
          request.data.readUInt16BE(2),
        ).toBe(0x0000);
      },
    );
  },
);