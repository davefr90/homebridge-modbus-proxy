import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterByteOrder } from '../../src/model/RegisterByteOrder.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { ValueConverter } from '../../src/model/ValueConverter.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'ValueConverter',
  () => {

    const converter =
      new ValueConverter();

    function definition(
      dataType: RegisterDataType,
      length = 1,
    ): RegisterDefinition {

      return {
        unitId: 1,
        function: PollFunction.ReadHoldingRegisters,
        address: 100,
        length,
        dataType,
        name: 'Test',
      };

    }

    it(
      'converts boolean values',
      () => {

        expect(
          converter.convert(
            definition(RegisterDataType.Boolean),
            new Uint16Array([0]),
          ),
        ).toBe(false);

        expect(
          converter.convert(
            definition(RegisterDataType.Boolean),
            new Uint16Array([1]),
          ),
        ).toBe(true);

      },
    );

    it(
      'converts uint16 values',
      () => {

        expect(
          converter.convert(
            definition(RegisterDataType.Uint16),
            new Uint16Array([1234]),
          ),
        ).toBe(1234);

      },
    );

    it(
      'converts int16 values',
      () => {

        expect(
          converter.convert(
            definition(RegisterDataType.Int16),
            new Uint16Array([65535]),
          ),
        ).toBe(-1);

      },
    );

    it(
      'converts uint32 values in ABCD order',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.Uint32,
              2,
            ),
            new Uint16Array([
              0x0001,
              0x0002,
            ]),
          ),
        ).toBe(65538);

      },
    );

    it(
      'converts uint32 values in CDAB order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.CDAB;

        expect(
          converter.convert(
            def,
            new Uint16Array([
              0x0002,
              0x0001,
            ]),
          ),
        ).toBe(65538);

      },
    );

    it(
      'converts uint32 values in BADC order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.BADC;

        expect(
          converter.convert(
            def,
            new Uint16Array([
              0x0100,
              0x0200,
            ]),
          ),
        ).toBe(65538);

      },
    );

    it(
      'converts uint32 values in DCBA order',
      () => {

        const def =
          definition(
            RegisterDataType.Uint32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.DCBA;

        expect(
          converter.convert(
            def,
            new Uint16Array([
              0x0200,
              0x0100,
            ]),
          ),
        ).toBe(65538);

      },
    );

    it(
      'converts int32 values',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.Int32,
              2,
            ),
            new Uint16Array([
              0xFFFF,
              0xFFFF,
            ]),
          ),
        ).toBe(-1);

      },
    );

    it(
      'converts float32 values in ABCD order',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.Float32,
              2,
            ),
            new Uint16Array([
              0x4148,
              0x0000,
            ]),
          ),
        ).toBeCloseTo(
          12.5,
          5,
        );

      },
    );

    it(
      'converts float32 values in CDAB order',
      () => {

        const def =
          definition(
            RegisterDataType.Float32,
            2,
          );

        def.byteOrder =
          RegisterByteOrder.CDAB;

        expect(
          converter.convert(
            def,
            new Uint16Array([
              0x0000,
              0x4148,
            ]),
          ),
        ).toBeCloseTo(
          12.5,
          5,
        );

      },
    );

    it(
      'converts register values into a string',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.String,
              3,
            ),
            new Uint16Array([
              0x4845,
              0x4C4C,
              0x4F00,
            ]),
          ),
        ).toBe('HELLO');

      },
    );

    it(
      'stops string conversion at the first null byte',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.String,
              4,
            ),
            new Uint16Array([
              0x4D6F,
              0x6462,
              0x7573,
              0x0000,
            ]),
          ),
        ).toBe('Modbus');

      },
    );

    it(
      'preserves spaces inside strings',
      () => {

        expect(
          converter.convert(
            definition(
              RegisterDataType.String,
              5,
            ),
            new Uint16Array([
              0x486F,
              0x6D65,
              0x2042,
              0x7269,
              0x6467,
            ]),
          ),
        ).toBe('Home Bridg');

      },
    );

    it(
      'applies scale factors',
      () => {

        const def =
          definition(
            RegisterDataType.Uint16,
          );

        def.scale =
          0.1;

        expect(
          converter.convert(
            def,
            new Uint16Array([
              2534,
            ]),
          ),
        ).toBe(253.4);

      },
    );

  },
);