import { DeviceReader } from './DeviceReader.js';
import { DeviceWriter } from './DeviceWriter.js';

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
  ): Promise<boolean | number | string> {

    return this.reader.read(
      property,
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