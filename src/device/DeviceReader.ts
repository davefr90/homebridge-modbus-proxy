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
 * Value returned for a logical device property.
 */
export type DeviceValue =
  RegisterValue |
  undefined;

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
  ): Promise<DeviceValue> {

    const definition =
      this.registerMap.get(
        property,
      );

    const value =
      this.normalizeValue(
        definition,
        await this.registerReader.read(
          definition,
        ),
      );

    if (value === undefined) {
      return undefined;
    }

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
      this.normalizeValue(
        scaleDefinition,
        await this.registerReader.read(
          scaleDefinition,
        ),
      );

    if (scaleFactor === undefined) {
      return undefined;
    }

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
        DeviceValue
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

    const groupResults:
      ReadonlyMap<
        RegisterDefinition,
        RegisterValue
      >[] = [];

    /*
     * Execute groups sequentially. Some Modbus TCP gateways,
     * including SolarEdge secondary inverter forwarding, close
     * the connection when multiple requests are outstanding on
     * the same socket.
     */
    for (const group of groups) {
      groupResults.push(
        await this.registerReader.readGroup(
          group,
        ),
      );
    }

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
        DeviceValue
      > = {};

    for (
      const {
        property,
        definition,
      }
      of requested
    ) {

      const value =
        this.normalizeValue(
          definition,
          this.groupValue(
            rawValues,
            definition,
          ),
        );

      if (value === undefined) {
        values[property] =
          undefined;

        continue;
      }

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
        this.normalizeValue(
          scaleDefinition,
          this.groupValue(
            rawValues,
            scaleDefinition,
          ),
        );

      if (scaleFactor === undefined) {
        values[property] =
          undefined;

        continue;
      }

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
   * Converts a configured not-implemented value into an
   * unavailable logical device value.
   */
  private normalizeValue(
    definition: RegisterDefinition,
    value: RegisterValue,
  ): DeviceValue {

    if (
      definition.notImplementedValue !== undefined
      && value === definition.notImplementedValue
    ) {
      return undefined;
    }

    return value;

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

    if (
      !values.has(
        definition,
      )
    ) {
      throw new Error(
        'No grouped value returned for register: '
        + definition.name,
      );
    }

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
