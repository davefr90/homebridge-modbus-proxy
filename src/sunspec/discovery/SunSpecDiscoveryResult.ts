import type {
  SunSpecDiscoveredModel,
} from './SunSpecDiscoveredModel.js';

/**
 * Contains the result of a successful SunSpec discovery.
 */
export class SunSpecDiscoveryResult {

  private readonly discoveredModels:
    readonly SunSpecDiscoveredModel[];

  /**
   * Creates a new discovery result.
   *
   * @param unitId Modbus unit identifier.
   * @param baseAddress Address of the first SunSpec identifier register.
   * @param models Discovered SunSpec models.
   */
  public constructor(

    public readonly unitId: number,

    public readonly baseAddress: number,

    models: readonly SunSpecDiscoveredModel[],

  ) {

    if (
      !Number.isInteger(
        unitId,
      )
      || unitId < 1
      || unitId > 247
    ) {
      throw new Error(
        `Invalid Modbus unit ID: ${unitId}`,
      );
    }

    if (
      !Number.isInteger(
        baseAddress,
      )
      || baseAddress < 0
      || baseAddress > 65535
    ) {
      throw new Error(
        `Invalid SunSpec base address: ${baseAddress}`,
      );
    }

    this.discoveredModels =
      Object.freeze(
        models.map(
          (model) =>
            Object.freeze({
              ...model,
            }),
        ),
      );

  }

  /**
   * Returns all discovered SunSpec models.
   */
  public models(): readonly SunSpecDiscoveredModel[] {

    return this.discoveredModels;

  }

  /**
   * Returns the number of discovered models.
   */
  public size(): number {

    return this.discoveredModels.length;

  }

  /**
   * Returns whether the supplied model ID was discovered.
   */
  public hasModel(
    modelId: number,
  ): boolean {

    return this.discoveredModels.some(
      (model) =>
        model.id === modelId,
    );

  }

  /**
   * Returns the first discovered model with the supplied ID.
   *
   * Some SunSpec model types can occur more than once.
   */
  public model(
    modelId: number,
  ): SunSpecDiscoveredModel {

    const model =
      this.discoveredModels.find(
        (candidate) =>
          candidate.id === modelId,
      );

    if (model === undefined) {
      throw new Error(
        `SunSpec model not found: ${modelId}`,
      );
    }

    return model;

  }

  /**
   * Returns all discovered models with the supplied ID.
   *
   * Repeating SunSpec models can occur multiple times.
   */
  public modelsById(
    modelId: number,
  ): readonly SunSpecDiscoveredModel[] {

    return this.discoveredModels.filter(
      (model) =>
        model.id === modelId,
    );

  }

}