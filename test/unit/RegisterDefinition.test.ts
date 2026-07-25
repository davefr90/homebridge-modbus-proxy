import {
  describe,
  expect,
  it,
} from 'vitest';

import { PollFunction } from '../../src/polling/PollFunction.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';

describe(
  'RegisterDefinition',
  () => {
    it(
      'creates a valid register definition',
      () => {
        const definition:
          RegisterDefinition = {
          unitId: 1,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 40001,
          length: 2,
          dataType:
            RegisterDataType.Float32,
          scale: 0.1,
          writable: true,
          name: 'Battery Voltage',
          unit: 'V',
        };

        expect(
          definition.name,
        ).toBe(
          'Battery Voltage',
        );

        expect(
          definition.dataType,
        ).toBe(
          RegisterDataType.Float32,
        );

        expect(
          definition.scale,
        ).toBe(0.1);
      },
    );
  },
);