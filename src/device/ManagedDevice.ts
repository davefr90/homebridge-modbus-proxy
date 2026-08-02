import type {
  DeviceValue,
} from './DeviceReader.js';

import {
  DeviceReader,
} from './DeviceReader.js';

import {
  DeviceWriter,
} from './DeviceWriter.js';

/**
 * Represents a logical Modbus device.
 */
export class ManagedDevice {

  public constructor(
    private readonly reader: DeviceReader,
    private readonly writer: DeviceWriter,
  ) {}

  /**
   * Reads a logical device property.
   */
  public async read(
    property: string,
  ): Promise<DeviceValue> {

    return this.reader.read(
      property,
    );

  }

  /**
   * Reads multiple logical device properties using
   * optimized contiguous Modbus block requests.
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

    return this.reader.readMany(
      properties,
    );

  }

  /**
   * Writes a logical device property.
   */
  public async write(
    property: string,
    value: boolean | number | string,
  ): Promise<void> {

    await this.writer.write(
      property,
      value,
    );

  }

}
