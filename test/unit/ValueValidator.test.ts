import {
  describe,
  expect,
  it,
} from 'vitest';

import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { ValueValidator } from '../../src/model/ValueValidator.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'ValueValidator',
  () => {

    const validator =
      new ValueValidator();

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

    it('accepts valid uint16 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint16),
          65535,
        ),
      ).not.toThrow();

    });

    it('rejects uint16 values above range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint16),
          65536,
        ),
      ).toThrow();

    });

    it('rejects negative uint16 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint16),
          -1,
        ),
      ).toThrow();

    });

    it('accepts valid int16 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int16),
          -32768,
        ),
      ).not.toThrow();

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int16),
          32767,
        ),
      ).not.toThrow();

    });

    it('rejects int16 values below range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int16),
          -32769,
        ),
      ).toThrow();

    });

    it('rejects int16 values above range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int16),
          32768,
        ),
      ).toThrow();

    });

    it('accepts valid uint32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint32),
          4294967295,
        ),
      ).not.toThrow();

    });

    it('rejects negative uint32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint32),
          -1,
        ),
      ).toThrow();

    });

    it('rejects uint32 values above range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Uint32),
          4294967296,
        ),
      ).toThrow();

    });

    it('accepts valid int32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int32),
          -2147483648,
        ),
      ).not.toThrow();

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int32),
          2147483647,
        ),
      ).not.toThrow();

    });

    it('rejects int32 values below range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int32),
          -2147483649,
        ),
      ).toThrow();

    });

    it('rejects int32 values above range', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Int32),
          2147483648,
        ),
      ).toThrow();

    });

    it('accepts valid float32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Float32),
          123.456,
        ),
      ).not.toThrow();

    });

    it('accepts integer float32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Float32),
          42,
        ),
      ).not.toThrow();

    });

    it('rejects NaN float32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Float32),
          Number.NaN,
        ),
      ).toThrow();

    });

    it('rejects infinite float32 values', () => {

      expect(() =>
        validator.validate(
          definition(RegisterDataType.Float32),
          Number.POSITIVE_INFINITY,
        ),
      ).toThrow();

    });

    it('accepts valid strings', () => {

      expect(() =>
        validator.validate(
          definition(
            RegisterDataType.String,
            4,
          ),
          'ABCDEFG',
        ),
      ).not.toThrow();

    });

    it('rejects strings that are too long', () => {

      expect(() =>
        validator.validate(
          definition(
            RegisterDataType.String,
            4,
          ),
          'ABCDEFGHI',
        ),
      ).toThrow();

    });

    it('accepts empty strings', () => {

      expect(() =>
        validator.validate(
          definition(
            RegisterDataType.String,
            2,
          ),
          '',
        ),
      ).not.toThrow();

    });

    it('rejects non-string values', () => {

      expect(() =>
        validator.validate(
          definition(
            RegisterDataType.String,
            2,
          ),
          123,
        ),
      ).toThrow();

    });

  },
);