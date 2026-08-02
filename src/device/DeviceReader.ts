import type {
  RegisterDefinition,
} from '../model/RegisterDefinition.js';

import {
  RegisterGroupBuilder,
} from '../model/RegisterGroupBuilder.js';

import {
  RegisterReader,
} from '../model/RegisterReader.js';

import type {
  RegisterValue,
} from '../model/RegisterReader.js';

import {
  DeviceRegisterMap,
} from './DeviceRegisterMap.js';

/**
 * Reads logical device properties.
 */
export class DeviceReader {

  public constructor(
    private readonly registerMap: DeviceRegisterMap,
    private readonly registerReader: RegisterReader,
    private readonly registerGroupBuilder =
    new RegisterGroupBuilder(
      {
        maxGap: 124,
        maxRegistersPerGroup: 125,
      },
    ),
  ) {}

  /**
   * Reads a logical device property.
   */
  public async read(
    property: string,
  ): Promise<RegisterValue> {

    const definition =
      this.registerMap.get(
        property,
      );

    const value =
      await this.registerReader.read(
        definition,
      );

    if (
      definition.scaleProperty === undefined
    ) {
      return value;
    }

    if (typeof value !== 'number') {
      throw new Error(
        `Dynamic scaling requires a numeric value: ${property}`,
      );
    }

    if (
      definition.scaleProperty === property
    ) {
      throw new Error(
        `Register cannot reference itself as scale property: ${property}`,
      );
    }

    const scaleDefinition =
      this.registerMap.get(
        definition.scaleProperty,
      );

    const scaleFactor =
      await this.registerReader.read(
        scaleDefinition,
      );

    if (typeof scaleFactor !== 'number') {
      throw new Error(
        `Scale property must contain a numeric value: ${definition.scaleProperty}`,
      );
    }

    return value * Math.pow(
      10,
      scaleFactor,
    );

  }

  /**
   * Reads multiple logical properties using optimized
   * contiguous Modbus block requests.
   *
   * Dynamic scale-factor registers are included in the same
   * read plan and therefore originate from the same snapshot.
   */
  public async readMany(
    properties: readonly string[],
  ): Promise<
    Readonly<
      Record<
        string,
        RegisterValue
      >
    >
  > {

    const requested =
      properties.map(
        (property) => ({
          property,
          definition:
            this.registerMap.get(
              property,
            ),
        }),
      );

    const definitions =
      new Set<RegisterDefinition>();

    for (
      const {
        property,
        definition,
      }
      of requested
    ) {

      definitions.add(
        definition,
      );

      if (
        definition.scaleProperty === undefined
      ) {
        continue;
      }

      if (
        definition.scaleProperty === property
      ) {
        throw new Error(
          `Register cannot reference itself as scale property: ${property}`,
        );
      }

      definitions.add(
        this.registerMap.get(
          definition.scaleProperty,
        ),
      );

    }

    const groups =
      this.registerGroupBuilder.build(
        [
          ...definitions,
        ],
      );

    const groupResults =
      await Promise.all(
        groups.map(
          (group) =>
            this.registerReader.readGroup(
              group,
            ),
        ),
      );

    const rawValues =
      new Map<
        RegisterDefinition,
        RegisterValue
      >();

    for (const groupResult of groupResults) {
      for (
        const [
          definition,
          value,
        ]
        of groupResult
      ) {
        rawValues.set(
          definition,
          value,
        );
      }
    }

    const values:
      Record<
        string,
        RegisterValue
      > = {};

    for (
      const {
        property,
        definition,
      }
      of requested
    ) {

      const value =
        this.groupValue(
          rawValues,
          definition,
        );

      if (
        definition.scaleProperty === undefined
      ) {
        values[property] =
          value;

        continue;
      }

      if (typeof value !== 'number') {
        throw new Error(
          `Dynamic scaling requires a numeric value: ${property}`,
        );
      }

      const scaleDefinition =
        this.registerMap.get(
          definition.scaleProperty,
        );

      const scaleFactor =
        this.groupValue(
          rawValues,
          scaleDefinition,
        );

      if (typeof scaleFactor !== 'number') {
        throw new Error(
          `Scale property must contain a numeric value: ${definition.scaleProperty}`,
        );
      }

      values[property] =
        value * Math.pow(
          10,
          scaleFactor,
        );

    }

    return values;

  }

  /**
   * Returns a decoded value from a group result.
   */
  private groupValue(
    values: ReadonlyMap<
      RegisterDefinition,
      RegisterValue
    >,
    definition: RegisterDefinition,
  ): RegisterValue {

    const value =
      values.get(
        definition,
      );

    if (value === undefined) {
      throw new Error(
        `No grouped value returned for register: ${definition.name}`,
      );
    }

    return value;

  }

}
