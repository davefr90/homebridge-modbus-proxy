import { DeviceRegisterMap } from '../device/DeviceRegisterMap.js';
import type { RegisterDefinition } from '../model/RegisterDefinition.js';
import { SunSpecModel } from './SunSpecModel.js';

/**
 * Builds SunSpec models.
 */
export class SunSpecModelBuilder {

  private modelId: number | undefined;

  private modelName: string | undefined;

  private readonly registerMap =
    new DeviceRegisterMap();

  /**
   * Creates a new builder.
   */
  public static create(): SunSpecModelBuilder {

    return new SunSpecModelBuilder();

  }

  /**
   * Sets the SunSpec model id.
   */
  public id(
    id: number,
  ): this {

    this.modelId = id;

    return this;

  }

  /**
   * Sets the model name.
   */
  public name(
    name: string,
  ): this {

    this.modelName = name;

    return this;

  }

  /**
   * Adds a logical register.
   */
  public register(
    property: string,
    definition: RegisterDefinition,
  ): this {

    this.registerMap.add(
      property,
      definition,
    );

    return this;

  }

  /**
   * Builds the SunSpec model.
   */
  public build(): SunSpecModel {

    if (
      this.modelId === undefined
    ) {
      throw new Error(
        'SunSpec model id is required.',
      );
    }

    if (
      this.modelName === undefined
    ) {
      throw new Error(
        'SunSpec model name is required.',
      );
    }

    return new SunSpecModel(
      this.modelId,
      this.modelName,
      this.registerMap,
    );

  }

}