import type { RegisterDefinition } from '../model/RegisterDefinition.js';

/**
 * Maps logical property names to Modbus register definitions.
 */
export class DeviceRegisterMap {

  private readonly registers =
    new Map<string, RegisterDefinition>();

  public add(
    property: string,
    definition: RegisterDefinition,
  ): void {

    this.registers.set(
      property,
      definition,
    );

  }

  public get(
    property: string,
  ): RegisterDefinition {

    const definition =
      this.registers.get(
        property,
      );

    if (definition === undefined) {
      throw new Error(
        `Unknown device property: ${property}`,
      );
    }

    return definition;

  }

  public has(
    property: string,
  ): boolean {

    return this.registers.has(
      property,
    );

  }

}