import { RegisterReader } from '../model/RegisterReader.js';
import { DeviceRegisterMap } from './DeviceRegisterMap.js';

/**
 * Reads logical device properties.
 */
export class DeviceReader {

  public constructor(
    private readonly registerMap: DeviceRegisterMap,
    private readonly registerReader: RegisterReader,
  ) {}

  /**
   * Reads a logical device property.
   */
  public async read(
    property: string,
  ): Promise<boolean | number | string> {

    const definition =
      this.registerMap.get(
        property,
      );

    return this.registerReader.read(
      definition,
    );

  }

}