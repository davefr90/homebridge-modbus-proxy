import { DeviceRegisterMap } from './DeviceRegisterMap.js';
import { DeviceDefinition } from './DeviceDefinition.js';
import type { RegisterDefinition } from '../model/RegisterDefinition.js';

/**
 * Builder for device definitions.
 */
export class DeviceDefinitionBuilder {

  private manufacturerName: string | undefined;

  private modelName: string | undefined;

  private deviceName: string | undefined;

  private readonly registerMap =
    new DeviceRegisterMap();

  /**
   * Creates a new builder.
   */
  public static create(): DeviceDefinitionBuilder {

    return new DeviceDefinitionBuilder();

  }

  /**
   * Sets the manufacturer.
   */
  public manufacturer(
    manufacturer: string,
  ): this {

    this.manufacturerName =
      manufacturer;

    return this;

  }

  /**
   * Sets the model.
   */
  public model(
    model: string,
  ): this {

    this.modelName =
      model;

    return this;

  }

  /**
   * Sets the device name.
   */
  public name(
    name: string,
  ): this {

    this.deviceName =
      name;

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
   * Builds the device definition.
   */
  public build(): DeviceDefinition {

    if (
      this.manufacturerName === undefined
      || this.manufacturerName.trim() === ''
    ) {
      throw new Error(
        'Manufacturer is required.',
      );
    }

    if (
      this.modelName === undefined
      || this.modelName.trim() === ''
    ) {
      throw new Error(
        'Model is required.',
      );
    }

    if (
      this.deviceName === undefined
      || this.deviceName.trim() === ''
    ) {
      throw new Error(
        'Device name is required.',
      );
    }

    return new DeviceDefinition(

      {

        manufacturer:
          this.manufacturerName,

        model:
          this.modelName,

        name:
          this.deviceName,

      },

      this.registerMap,

    );

  }

}