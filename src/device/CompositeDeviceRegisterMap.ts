import type {
  RegisterDefinition,
} from '../model/RegisterDefinition.js';

import {
  DeviceRegisterMap,
} from './DeviceRegisterMap.js';

/**
 * Combines multiple device register maps into one
 * namespaced register map.
 *
 * Example:
 *
 * common.manufacturer
 * common.serialNumber
 * inverter.acPower
 * inverter.acPowerScaleFactor
 */
export class CompositeDeviceRegisterMap
  extends DeviceRegisterMap {

  private readonly namespaces =
    new Set<string>();

  /**
   * Creates an empty composite register map.
   */
  public static create():
    CompositeDeviceRegisterMap {

    return new CompositeDeviceRegisterMap();

  }

  /**
   * Adds all properties of a register map under the
   * supplied namespace.
   *
   * Dynamic scale-property references are automatically
   * qualified with the same namespace.
   *
   * @param namespace Namespace used for all properties.
   * @param registerMap Register map to add.
   */
  public addMap(
    namespace: string,
    registerMap: DeviceRegisterMap,
  ): this {

    const normalizedNamespace =
      namespace.trim();

    if (
      normalizedNamespace === ''
    ) {
      throw new Error(
        'Device register-map namespace must not be empty.',
      );
    }

    if (
      normalizedNamespace.includes(
        '.',
      )
    ) {
      throw new Error(
        `Device register-map namespace must not contain a dot: ${normalizedNamespace}`,
      );
    }

    if (
      this.namespaces.has(
        normalizedNamespace,
      )
    ) {
      throw new Error(
        `Device register-map namespace already exists: ${normalizedNamespace}`,
      );
    }

    /*
     * Validate the complete map before modifying this
     * composite instance. This prevents a partially added
     * namespace if one property is invalid.
     */
    const qualifiedEntries =
      registerMap.entries().map(
        (
          [
            property,
            definition,
          ],
        ) => {

          const qualifiedProperty =
            CompositeDeviceRegisterMap
              .qualify(
                normalizedNamespace,
                property,
              );

          const qualifiedDefinition =
            CompositeDeviceRegisterMap
              .qualifyDefinition(
                normalizedNamespace,
                definition,
              );

          if (
            this.has(
              qualifiedProperty,
            )
          ) {
            throw new Error(
              `Device property already registered: ${qualifiedProperty}`,
            );
          }

          return [
            qualifiedProperty,
            qualifiedDefinition,
          ] as const;

        },
      );

    for (
      const [
        property,
        definition,
      ]
      of qualifiedEntries
    ) {
      this.add(
        property,
        definition,
      );
    }

    this.namespaces.add(
      normalizedNamespace,
    );

    return this;

  }

  /**
   * Returns whether a namespace has already been added.
   */
  public hasNamespace(
    namespace: string,
  ): boolean {

    return this.namespaces.has(
      namespace.trim(),
    );

  }

  /**
   * Returns all registered namespaces.
   */
  public namespaceNames():
    readonly string[] {

    return [
      ...this.namespaces,
    ];

  }

  /**
   * Returns the number of registered namespaces.
   */
  public namespaceCount(): number {

    return this.namespaces.size;

  }

  /**
   * Creates a qualified property name.
   */
  private static qualify(
    namespace: string,
    property: string,
  ): string {

    return `${namespace}.${property}`;

  }

  /**
   * Creates a register definition whose dynamic scaling
   * reference points to the qualified property in the same
   * namespace.
   */
  private static qualifyDefinition(
    namespace: string,
    definition: RegisterDefinition,
  ): RegisterDefinition {

    if (
      definition.scaleProperty ===
      undefined
    ) {
      return definition;
    }

    return {
      ...definition,

      scaleProperty:
        CompositeDeviceRegisterMap
          .qualify(
            namespace,
            definition.scaleProperty,
          ),
    };

  }

}