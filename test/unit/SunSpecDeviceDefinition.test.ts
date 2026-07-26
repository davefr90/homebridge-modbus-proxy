import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceDefinitionBuilder } from '../../src/device/DeviceDefinitionBuilder.js';
import { SunSpecDeviceDefinition } from '../../src/device/SunSpecDeviceDefinition.js';

class TestSunSpecDevice
  extends SunSpecDeviceDefinition {

  public constructor() {

    super(

      DeviceDefinitionBuilder
        .create()
        .manufacturer(
          'SolarEdge',
        )
        .model(
          'SE10K',
        )
        .name(
          'Test Device',
        ),

    );

  }

}

describe(
  'SunSpecDeviceDefinition',
  () => {

    it(
      'creates a sunspec device',
      () => {

        const device =
          new TestSunSpecDevice();

        expect(
          device.info.manufacturer,
        ).toBe(
          'SolarEdge',
        );

        expect(
          device.info.model,
        ).toBe(
          'SE10K',
        );

        expect(
          device.info.name,
        ).toBe(
          'Test Device',
        );

      },
    );

  },
);