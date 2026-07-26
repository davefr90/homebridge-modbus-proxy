import type { RegisterDefinition } from './RegisterDefinition.js';
import { RegisterDataType } from './RegisterDataType.js';

interface IntegerRange {
  min: number;
  max: number;
}

/**
 * Validates values before they are encoded into Modbus registers.
 */
export class ValueValidator {

  private static readonly INTEGER_RANGES =
    new Map<RegisterDataType, IntegerRange>([
      [
        RegisterDataType.Uint16,
        {
          min: 0,
          max: 0xFFFF,
        },
      ],
      [
        RegisterDataType.Int16,
        {
          min: -0x8000,
          max: 0x7FFF,
        },
      ],
      [
        RegisterDataType.Uint32,
        {
          min: 0,
          max: 0xFFFFFFFF,
        },
      ],
      [
        RegisterDataType.Int32,
        {
          min: -0x80000000,
          max: 0x7FFFFFFF,
        },
      ],
    ]);

  public validate(
    definition: RegisterDefinition,
    value: boolean | number | string,
  ): void {

    const integerRange =
      ValueValidator.INTEGER_RANGES.get(
        definition.dataType,
      );

    if (integerRange !== undefined) {
      this.validateInteger(
        Number(value),
        integerRange.min,
        integerRange.max,
      );

      return;
    }

    switch (definition.dataType) {

      case RegisterDataType.Float32:

        this.validateFloat(
          Number(value),
        );

        return;

      case RegisterDataType.String:

        this.validateString(
          value,
          definition.length,
        );

        return;

      default:
        return;

    }

  }

  private validateInteger(
    value: number,
    min: number,
    max: number,
  ): void {

    if (!Number.isFinite(value)) {
      throw new Error(
        'Value must be a finite number.',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Value must be an integer.',
      );
    }

    if (value < min || value > max) {
      throw new Error(
        `Value must be between ${min} and ${max}.`,
      );
    }

  }

  private validateFloat(
    value: number,
  ): void {

    if (!Number.isFinite(value)) {
      throw new Error(
        'Value must be a finite number.',
      );
    }

  }

  private validateString(
    value: boolean | number | string,
    registerLength: number,
  ): void {

    if (typeof value !== 'string') {
      throw new Error(
        'Value must be a string.',
      );
    }

    const maximumLength =
      registerLength * 2;

    if (value.length > maximumLength) {
      throw new Error(
        `String length must not exceed ${maximumLength} characters.`,
      );
    }

  }

}