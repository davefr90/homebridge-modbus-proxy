import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterByteOrder } from '../../src/model/RegisterByteOrder.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { ValueEncoder } from '../../src/model/ValueEncoder.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'ValueEncoder',
  () => {

    const encoder =
      new ValueEncoder();

    function definition(
      dataType: RegisterDataType,
      length = 1,
    ): RegisterDefinition {

      return {
        unitId: 1,
        function: PollFunction.ReadHoldingRegisters,
        address: 0,
        length,
        dataType,
        name: 'Test',
      };

    }

    it(
      'encodes boolean values',
      () => {

        expect(
          encoder.encode(
            definition(RegisterDataType.Boolean),
            true,
          ),
        ).toEqual(
          new Uint16Array([1]),
        );

        expect(
          encoder.encode(
            definition(RegisterDataType.Boolean),
            false,
          ),
        ).toEqual(
          new Uint16Array([0]),
        );

      },
    );

    it(
      'encodes uint16 values',
      () => {

        expect(
          encoder.encode(
            definition(RegisterDataType.Uint16),
            1234,
          ),
        ).toEqual(
          new Uint16Array([1234]),
        );

      },
    );

    it(
      'encodes int16 values',
      () => {

        expect(
          encoder.encode(
            definition(RegisterDataType.Int16),
            -1,
          ),
        ).toEqual(
          new Uint16Array([
            0xFFFF,
          ]),
        );

      },
    );

    it(
      'encodes uint32 values in ABCD order',
      () => {

        expect(
          encoder.encode(
            definition(
              RegisterDataType.Uint32,
              2,
            ),
            65538,
          ),
        ).toEqual(
          new Uint16Array([
            0x0001,
            0x0002,
          ]),
        );

      },
    );

    it(
      'encodes uint32 values in CDAB order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.CDAB;

        expect(
          encoder.encode(
            def,
            65538,
          ),
        ).toEqual(
          new Uint16Array([
            0x0002,
            0x0001,
          ]),
        );

      },
    );

    it(
      'encodes uint32 values in BADC order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.BADC;

        expect(
          encoder.encode(
            def,
            65538,
          ),
        ).toEqual(
          new Uint16Array([
            0x0100,
            0x0200,
          ]),
        );

      },
    );

    it(
      'encodes uint32 values in DCBA order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.DCBA;

        expect(
          encoder.encode(
            def,
            65538,
          ),
        ).toEqual(
          new Uint16Array([
            0x0200,
            0x0100,
          ]),
        );

      },
    );

    it(
      'encodes int32 values',
      () => {

        expect(
          encoder.encode(
            definition(
              RegisterDataType.Int32,
              2,
            ),
            -1,
          ),
        ).toEqual(
          new Uint16Array([
            0xFFFF,
            0xFFFF,
          ]),
        );

      },
    );

    it(
      'encodes float32 values in ABCD order',
      () => {

        expect(
          encoder.encode(
            definition(
              RegisterDataType.Float32,
              2,
            ),
            12.5,
          ),
        ).toEqual(
          new Uint16Array([
            0x4148,
            0x0000,
          ]),
        );

      },
    );

    it(
      'encodes float32 values in CDAB order',
      () => {

        const def =
          definition(
            RegisterDataType.Float32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.CDAB;

        expect(
          encoder.encode(
            def,
            12.5,
          ),
        ).toEqual(
          new Uint16Array([
            0x0000,
            0x4148,
          ]),
        );

      },
    );

    it(
      'encodes string values',
      () => {

        expect(
          encoder.encode(
            definition(
              RegisterDataType.String,
              4,
            ),
            'ABCD',
          ),
        ).toEqual(
          new Uint16Array([
            0x4142,
            0x4344,
            0x0000,
            0x0000,
          ]),
        );

      },
    );

  },
);