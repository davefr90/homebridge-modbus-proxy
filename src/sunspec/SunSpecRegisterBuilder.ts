import { RegisterDataType } from '../model/RegisterDataType.js';
import { RegisterDefinition } from '../model/RegisterDefinition.js';
import { RegisterDefinitionBuilder } from '../model/RegisterDefinitionBuilder.js';

export class SunSpecRegisterBuilder {

  private readonly builder: RegisterDefinitionBuilder;

  private constructor(
    unitId: number,
    address: number,
  ) {

    this.builder =
      RegisterDefinitionBuilder
        .create()
        .unitId(
          unitId,
        )
        .holdingRegister()
        .address(
          address,
        );

  }

  public static create(
    unitId: number,
    address: number,
  ): SunSpecRegisterBuilder {

    return new SunSpecRegisterBuilder(
      unitId,
      address,
    );

  }

  public uint16(): this {

    this.builder
      .length(1)
      .dataType(
        RegisterDataType.Uint16,
      );

    return this;

  }

  public int16(): this {

    this.builder
      .length(1)
      .dataType(
        RegisterDataType.Int16,
      );

    return this;

  }

  public uint32(): this {

    this.builder
      .length(2)
      .dataType(
        RegisterDataType.Uint32,
      );

    return this;

  }

  public int32(): this {

    this.builder
      .length(2)
      .dataType(
        RegisterDataType.Int32,
      );

    return this;

  }

  public float32(): this {

    this.builder
      .length(2)
      .dataType(
        RegisterDataType.Float32,
      );

    return this;

  }

  public string(
    registerCount: number,
  ): this {

    this.builder
      .length(
        registerCount,
      )
      .dataType(
        RegisterDataType.String,
      );

    return this;

  }

  public enum16(): this {

    return this.uint16();

  }

  public bitfield16(): this {

    return this.uint16();

  }

  public bitfield32(): this {

    return this.uint32();

  }

  public acc32(): this {

    return this.uint32();

  }

  public acc64(): this {

    throw new Error(
      'SunSpec acc64 is not implemented yet.',
    );

  }

  public sunssf(): this {

    return this.int16();

  }

  public name(
    name: string,
  ): this {

    this.builder.name(
      name,
    );

    return this;

  }

  public unit(
    unit: string,
  ): this {

    this.builder.unit(
      unit,
    );

    return this;

  }

  public scaleProperty(
    property: string,
  ): this {

    this.builder.scaleProperty(
      property,
    );

    return this;

  }

  public notImplementedValue(
    value: number,
  ): this {

    this.builder.notImplementedValue(
      value,
    );

    return this;

  }

  public build(): RegisterDefinition {

    return this.builder.build();

  }

}
