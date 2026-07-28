import { SunSpecModel } from './SunSpecModel.js';

/**
 * Contains all SunSpec models belonging to a device.
 */
export class SunSpecModelContainer {

  private readonly modelMap =
    new Map<number, SunSpecModel>();

  /**
   * Adds a SunSpec model.
   */
  public add(
    model: SunSpecModel,
  ): this {

    if (
      this.modelMap.has(
        model.id,
      )
    ) {
      throw new Error(
        `SunSpec model already exists: ${model.id}`,
      );
    }

    this.modelMap.set(
      model.id,
      model,
    );

    return this;

  }

  /**
   * Returns a model by its SunSpec model id.
   */
  public get(
    modelId: number,
  ): SunSpecModel {

    const model =
      this.modelMap.get(
        modelId,
      );

    if (model === undefined) {
      throw new Error(
        `Unknown SunSpec model: ${modelId}`,
      );
    }

    return model;

  }

  /**
   * Checks whether a model exists.
   */
  public has(
    modelId: number,
  ): boolean {

    return this.modelMap.has(
      modelId,
    );

  }

  /**
   * Returns all models.
   */
  public models(): readonly SunSpecModel[] {

    return [
      ...this.modelMap.values(),
    ];

  }

  /**
   * Returns the number of models.
   */
  public size(): number {

    return this.modelMap.size;

  }

}