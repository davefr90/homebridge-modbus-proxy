import { RegisterWriter } from '../model/RegisterWriter.js';
import { DeviceRegisterMap } from './DeviceRegisterMap.js';

/**
 * Writes logical device properties.
 */
export class DeviceWriter {

  public constructor(
    private readonly registerMap: DeviceRegisterMap,
    private readonly registerWriter: RegisterWriter,
  ) {}

  /**
   * Writes a logical device property.
   */
  public async write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    const definition =
      this.registerMap.get(
        property,
      );

    await this.registerWriter.write(
      definition,
      value,
    );

  }

}