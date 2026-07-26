import type { DeviceDefinition } from './DeviceDefinition.js';

/**
 * Stores available device definitions.
 */
export class DeviceCatalog {

  private readonly definitions =
    new Map<string, DeviceDefinition>();

  /**
   * Registers a device definition.
   */
  public register(
    id: string,
    definition: DeviceDefinition,
  ): void {

    if (this.definitions.has(id)) {
      throw new Error(
        `Device definition already registered: ${id}`,
      );
    }

    this.definitions.set(
      id,
      definition,
    );

  }

  /**
   * Returns a device definition.
   */
  public get(
    id: string,
  ): DeviceDefinition {

    const definition =
      this.definitions.get(
        id,
      );

    if (definition === undefined) {
      throw new Error(
        `Unknown device definition: ${id}`,
      );
    }

    return definition;

  }

  /**
   * Checks whether a definition exists.
   */
  public has(
    id: string,
  ): boolean {

    return this.definitions.has(
      id,
    );

  }

  /**
   * Removes a definition.
   */
  public remove(
    id: string,
  ): boolean {

    return this.definitions.delete(
      id,
    );

  }

  /**
   * Returns all definition ids.
   */
  public ids(): string[] {

    return [
      ...this.definitions.keys(),
    ];

  }

}