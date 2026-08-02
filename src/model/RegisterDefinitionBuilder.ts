import { PollFunction } from '../polling/PollFunction.js';
import { RegisterByteOrder } from './RegisterByteOrder.js';
import { RegisterDataType } from './RegisterDataType.js';
import type { RegisterDefinition } from './RegisterDefinition.js';

/**
 * Builds Modbus register definitions.
 */
export class RegisterDefinitionBuilder {

  private registerUnitId: number | undefined;

  private registerFunction: PollFunction | undefined;

  private registerAddress: number | undefined;

  private registerLength: number | undefined;

  private registerDataType: RegisterDataType | undefined;

  private registerByteOrder: RegisterByteOrder | undefined;

  private registerPollIntervalMs: number | undefined;

  private registerScale: number | undefined;

  private registerScaleProperty: string | undefined;

  private registerNotImplementedValue: number | undefined;

  private registerWritable: boolean | undefined;

  private registerName: string | undefined;

  private registerUnit: string | undefined;

  /**
   * Creates a new register definition builder.
   */
  public static create(): RegisterDefinitionBuilder {

    return new RegisterDefinitionBuilder();

  }

  /**
   * Sets the Modbus unit id.
   */
  public unitId(
    unitId: number,
  ): this {

    this.registerUnitId =
      unitId;

    return this;

  }

  /**
   * Sets the Modbus polling function.
   */
  public function(
    functionCode: PollFunction,
  ): this {

    this.registerFunction =
      functionCode;

    return this;

  }

  /**
   * Configures a holding register.
   */
  public holdingRegister(): this {

    return this.function(
      PollFunction.ReadHoldingRegisters,
    );

  }

  /**
   * Configures an input register.
   */
  public inputRegister(): this {

    return this.function(
      PollFunction.ReadInputRegisters,
    );

  }

  /**
   * Configures a coil.
   */
  public coil(): this {

    return this.function(
      PollFunction.ReadCoils,
    );

  }

  /**
   * Configures a discrete input.
   */
  public discreteInput(): this {

    return this.function(
      PollFunction.ReadDiscreteInputs,
    );

  }

  /**
   * Sets the register start address.
   */
  public address(
    address: number,
  ): this {

    this.registerAddress =
      address;

    return this;

  }

  /**
   * Sets the number of Modbus registers.
   */
  public length(
    length: number,
  ): this {

    this.registerLength =
      length;

    return this;

  }

  /**
   * Sets the register data type.
   */
  public dataType(
    dataType: RegisterDataType,
  ): this {

    this.registerDataType =
      dataType;

    return this;

  }

  /**
   * Sets the byte order.
   */
  public byteOrder(
    byteOrder: RegisterByteOrder,
  ): this {

    this.registerByteOrder =
      byteOrder;

    return this;

  }

  /**
   * Sets the polling interval in milliseconds.
   */
  public pollIntervalMs(
    pollIntervalMs: number,
  ): this {

    this.registerPollIntervalMs =
      pollIntervalMs;

    return this;

  }

  /**
   * Sets a fixed scale factor.
   */
  public scale(
    scale: number,
  ): this {

    this.registerScale =
      scale;

    return this;

  }

  /**
   * Sets the logical property containing a dynamic scale factor.
   */
  public scaleProperty(
    property: string,
  ): this {

    this.registerScaleProperty =
      property;

    return this;

  }

  /**
   * Sets the decoded value that represents a SunSpec
   * not-implemented point.
   */
  public notImplementedValue(
    value: number,
  ): this {

    this.registerNotImplementedValue =
      value;

    return this;

  }

  /**
   * Marks the register as writable or read-only.
   */
  public writable(
    writable = true,
  ): this {

    this.registerWritable =
      writable;

    return this;

  }

  /**
   * Sets the human-readable register name.
   */
  public name(
    name: string,
  ): this {

    this.registerName =
      name;

    return this;

  }

  /**
   * Sets the engineering unit.
   */
  public unit(
    unit: string,
  ): this {

    this.registerUnit =
      unit;

    return this;

  }

  /**
   * Builds the register definition.
   */
  public build(): RegisterDefinition {

    if (this.registerUnitId === undefined) {
      throw new Error(
        'Register unit id is required.',
      );
    }

    if (this.registerFunction === undefined) {
      throw new Error(
        'Register function is required.',
      );
    }

    if (this.registerAddress === undefined) {
      throw new Error(
        'Register address is required.',
      );
    }

    if (this.registerLength === undefined) {
      throw new Error(
        'Register length is required.',
      );
    }

    if (this.registerDataType === undefined) {
      throw new Error(
        'Register data type is required.',
      );
    }

    if (this.registerName === undefined) {
      throw new Error(
        'Register name is required.',
      );
    }

    if (
      this.registerUnitId < 1
      || this.registerUnitId > 247
    ) {
      throw new Error(
        `Invalid Modbus unit id: ${this.registerUnitId}`,
      );
    }

    if (
      !Number.isInteger(
        this.registerAddress,
      )
      || this.registerAddress < 0
      || this.registerAddress > 65535
    ) {
      throw new Error(
        `Invalid register address: ${this.registerAddress}`,
      );
    }

    if (
      !Number.isInteger(
        this.registerLength,
      )
      || this.registerLength < 1
    ) {
      throw new Error(
        `Invalid register length: ${this.registerLength}`,
      );
    }

    if (
      this.registerPollIntervalMs !== undefined
      && (
        !Number.isInteger(
          this.registerPollIntervalMs,
        )
        || this.registerPollIntervalMs < 1
      )
    ) {
      throw new Error(
        `Invalid poll interval: ${this.registerPollIntervalMs}`,
      );
    }

    if (
      this.registerName.trim() === ''
    ) {
      throw new Error(
        'Register name must not be empty.',
      );
    }

    if (
      this.registerScale !== undefined
      && !Number.isFinite(
        this.registerScale,
      )
    ) {
      throw new Error(
        `Invalid scale factor: ${this.registerScale}`,
      );
    }

    if (
      this.registerScaleProperty !== undefined
      && this.registerScaleProperty.trim() === ''
    ) {
      throw new Error(
        'Scale property must not be empty.',
      );
    }

    if (
      this.registerScale !== undefined
      && this.registerScaleProperty !== undefined
    ) {
      throw new Error(
        'A register cannot use both a fixed scale and a scale property.',
      );
    }

    if (
      this.registerNotImplementedValue !== undefined
      && !Number.isFinite(
        this.registerNotImplementedValue,
      )
    ) {
      throw new Error(
        'Invalid not-implemented value: '
        + this.registerNotImplementedValue,
      );
    }

    return {

      unitId:
        this.registerUnitId,

      function:
        this.registerFunction,

      address:
        this.registerAddress,

      length:
        this.registerLength,

      dataType:
        this.registerDataType,

      ...(this.registerByteOrder === undefined
        ? {}
        : {
          byteOrder:
              this.registerByteOrder,
        }),

      ...(this.registerPollIntervalMs === undefined
        ? {}
        : {
          pollIntervalMs:
              this.registerPollIntervalMs,
        }),

      ...(this.registerScale === undefined
        ? {}
        : {
          scale:
              this.registerScale,
        }),

      ...(this.registerScaleProperty === undefined
        ? {}
        : {
          scaleProperty:
              this.registerScaleProperty,
        }),

      ...(this.registerNotImplementedValue === undefined
        ? {}
        : {
          notImplementedValue:
              this.registerNotImplementedValue,
        }),

      ...(this.registerWritable === undefined
        ? {}
        : {
          writable:
              this.registerWritable,
        }),

      name:
        this.registerName,

      ...(this.registerUnit === undefined
        ? {}
        : {
          unit:
              this.registerUnit,
        }),

    };

  }

}
