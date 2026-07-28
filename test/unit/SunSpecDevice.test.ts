import {
  describe,
  expect,
  it,
} from 'vitest';

import { SunSpecDevice } from '../../src/sunspec/devices/SunSpecDevice.js';
import { SunSpecDeviceBuilder } from '../../src/sunspec/SunSpecDeviceBuilder.js';

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
          new SunSpecDevice(
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
          new SunSpecDevice(
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
          new SunSpecDevice(
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
          new SunSpecDevice(
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
          new SunSpecDevice(
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