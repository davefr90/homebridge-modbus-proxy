import type { RegisterDefinition } from '../model/RegisterDefinition.js';

/**
 * Maps logical property names to Modbus register definitions.
 */
export class DeviceRegisterMap {

  private readonly registers =
    new Map<string, RegisterDefinition>();

  /**
   * Adds a register definition for a logical device property.
   */
  public add(
    property: string,
    definition: RegisterDefinition,
  ): void {

    if (property.trim() === '') {
      throw new Error(
        'Device property must not be empty.',
      );
    }

    if (
      this.registers.has(
        property,
      )
    ) {
      throw new Error(
        `Device property already registered: ${property}`,
      );
    }

    this.registers.set(
      property,
      definition,
    );

  }

  /**
   * Returns the register definition for a logical property.
   */
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

  /**
   * Checks whether a logical property exists.
   */
  public has(
    property: string,
  ): boolean {

    return this.registers.has(
      property,
    );

  }

  /**
   * Returns all registered logical property names.
   */
  public properties(): readonly string[] {

    return [
      ...this.registers.keys(),
    ];

  }

  /**
   * Returns all registered register definitions.
   */
  public definitions(): readonly RegisterDefinition[] {

    return [
      ...this.registers.values(),
    ];

  }

  /**
   * Returns all logical properties and their register definitions.
   */
  public entries(): readonly (
    readonly [
      string,
      RegisterDefinition,
    ]
  )[] {

    return [
      ...this.registers.entries(),
    ];

  }

  /**
   * Returns the number of registered properties.
   */
  public size(): number {

    return this.registers.size;

  }

}