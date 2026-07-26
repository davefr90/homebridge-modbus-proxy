import type { DeviceDefinition } from './DeviceDefinition.js';

/**
 * Provides registered device definitions.
 */
export class DeviceDefinitionProvider {

  private readonly definitions =
    new Map<string, DeviceDefinition>();

  /**
   * Registers a device type.
   */
  public register(
    type: string,
    definition: DeviceDefinition,
  ): void {

    if (this.definitions.has(type)) {
      throw new Error(
        `Device type already registered: ${type}`,
      );
    }

    this.definitions.set(
      type,
      definition,
    );

  }

  /**
   * Returns the definition for a device type.
   */
  public get(
    type: string,
  ): DeviceDefinition {

    const definition =
      this.definitions.get(type);

    if (definition === undefined) {
      throw new Error(
        `Unknown device type: ${type}`,
      );
    }

    return definition;

  }

  /**
   * Checks whether a type exists.
   */
  public has(
    type: string,
  ): boolean {

    return this.definitions.has(
      type,
    );

  }

  /**
   * Returns all registered types.
   */
  public types(): string[] {

    return [
      ...this.definitions.keys(),
    ];

  }

}