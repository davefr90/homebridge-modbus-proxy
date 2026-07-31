import type {
  SunSpecDiscoveredModel,
} from '../discovery/SunSpecDiscoveredModel.js';

import {
  SunSpecDiscoveryResult,
} from '../discovery/SunSpecDiscoveryResult.js';

/**
 * Provides structural information about a discovered
 * SunSpec device.
 *
 * The information is created once during client
 * initialization and remains immutable for the lifetime
 * of the SunSpec device.
 */
export class SunSpecDeviceInformation {

  /**
   * Creates device information from a completed SunSpec
   * discovery.
   *
   * @param discoveryResult Result returned by
   * SunSpecDiscovery.
   */
  public constructor(

    private readonly discoveryResult:
      SunSpecDiscoveryResult,

  ) {
  }

  /**
   * Returns the Modbus unit identifier.
   */
  public get unitId():
    number {

    return this.discoveryResult
      .unitId;

  }

  /**
   * Returns the detected SunSpec base address.
   */
  public get baseAddress():
    number {

    return this.discoveryResult
      .baseAddress;

  }

  /**
   * Returns the complete discovery result.
   */
  public discovery():
    SunSpecDiscoveryResult {

    return this.discoveryResult;

  }

  /**
   * Returns all discovered SunSpec models.
   *
   * This includes models that are not yet implemented by
   * the library.
   */
  public models():
    readonly SunSpecDiscoveredModel[] {

    return this.discoveryResult
      .models();

  }

  /**
   * Returns the number of discovered SunSpec models.
   */
  public size():
    number {

    return this.discoveryResult
      .size();

  }

  /**
   * Returns whether a model with the supplied ID was
   * discovered.
   */
  public hasModel(
    modelId: number,
  ): boolean {

    return this.discoveryResult
      .hasModel(
        modelId,
      );

  }

  /**
   * Returns the first discovered model with the supplied
   * ID.
   *
   * @throws Error if the model was not discovered.
   */
  public model(
    modelId: number,
  ): SunSpecDiscoveredModel {

    return this.discoveryResult
      .model(
        modelId,
      );

  }

  /**
   * Returns the first discovered model with the supplied
   * ID, or undefined when it was not discovered.
   */
  public tryModel(
    modelId: number,
  ): SunSpecDiscoveredModel | undefined {

    return this.discoveryResult
      .tryModel(
        modelId,
      );

  }

  /**
   * Returns every discovered instance with the supplied
   * model ID.
   */
  public modelsById(
    modelId: number,
  ): readonly SunSpecDiscoveredModel[] {

    return this.discoveryResult
      .modelsById(
        modelId,
      );

  }

  /**
   * Returns all unique discovered model IDs in discovery
   * order.
   */
  public modelIds():
    readonly number[] {

    return this.discoveryResult
      .modelIds();

  }

}