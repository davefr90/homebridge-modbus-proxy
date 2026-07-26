import type { ModbusClient } from '../client/ModbusClient.js';
import type { DeviceDefinition } from '../device/DeviceDefinition.js';
import { DeviceReader } from '../device/DeviceReader.js';
import { DeviceWriter } from '../device/DeviceWriter.js';
import { ManagedDevice } from '../device/ManagedDevice.js';
import { RegisterReader } from './RegisterReader.js';
import { RegisterWriter } from './RegisterWriter.js';

/**
 * Creates fully configured managed devices.
 */
export class DeviceFactory {

  public constructor(
    private readonly client: ModbusClient,
  ) {}

  /**
   * Creates a managed device from a device definition.
   */
  public create(
    definition: DeviceDefinition,
  ): ManagedDevice {

    const registerReader =
      new RegisterReader(
        this.client,
      );

    const registerWriter =
      new RegisterWriter(
        this.client,
      );

    const deviceReader =
      new DeviceReader(
        definition.registerMap,
        registerReader,
      );

    const deviceWriter =
      new DeviceWriter(
        definition.registerMap,
        registerWriter,
      );

    return new ManagedDevice(
      deviceReader,
      deviceWriter,
    );

  }

}