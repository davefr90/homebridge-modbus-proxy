import {
  describe,
  expect,
  it,
} from 'vitest';

import type {
  ManagedDevice,
} from '../../src/device/ManagedDevice.js';

import {
  SunSpecDevice,
} from '../../src/sunspec/devices/SunSpecDevice.js';

import {
  SunSpecDeviceInformation,
} from '../../src/sunspec/devices/SunSpecDeviceInformation.js';

import {
  SunSpecDiscoveryResult,
} from '../../src/sunspec/discovery/SunSpecDiscoveryResult.js';

import {
  SunSpecDeviceBuilder,
} from '../../src/sunspec/SunSpecDeviceBuilder.js';

import type {
  SunSpecModelContainer,
} from '../../src/sunspec/SunSpecModelContainer.js';

/**
 * Creates a SunSpec device for model-container tests.
 *
 * These tests do not perform register reads or writes.
 * Therefore, a lightweight ManagedDevice placeholder is
 * sufficient.
 */
function createDevice(
  container: SunSpecModelContainer,
): SunSpecDevice {

  const discoveryResult =
    new SunSpecDiscoveryResult(
      1,
      40000,
      [],
    );

  const deviceInformation =
    new SunSpecDeviceInformation(
      discoveryResult,
    );

  const managedDevice =
    {} as ManagedDevice;

  return new SunSpecDevice(
    deviceInformation,
    container,
    managedDevice,
  );

}

describe(
  'SunSpecDevice',
  () => {

    it(
      'returns all models',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .model120()
            .build();

        const device =
          createDevice(
            container,
          );

        expect(
          device.models().length,
        ).toBe(
          3,
        );

      },
    );

    it(
      'returns the model count',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .build();

        const device =
          createDevice(
            container,
          );

        expect(
          device.size(),
        ).toBe(
          2,
        );

      },
    );

    it(
      'checks whether a model exists',
      () => {

        const device =
          createDevice(
            SunSpecDeviceBuilder
              .create()
              .common()
              .model103()
              .build(),
          );

        expect(
          device.hasModel(
            1,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            103,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            120,
          ),
        ).toBe(
          false,
        );

      },
    );

    it(
      'returns a model by its identifier',
      () => {

        const device =
          createDevice(
            SunSpecDeviceBuilder
              .create()
              .common()
              .model103()
              .build(),
          );

        expect(
          device.model(
            103,
          ).name,
        ).toBe(
          'Three-Phase Inverter',
        );

      },
    );

    it(
      'throws for an unknown model',
      () => {

        const device =
          createDevice(
            SunSpecDeviceBuilder
              .create()
              .common()
              .build(),
          );

        expect(
          () =>
            device.model(
              999,
            ),
        ).toThrow(
          'Unknown SunSpec model: 999',
        );

      },
    );

  },
);