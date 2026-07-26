import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceCatalog } from '../../src/device/DeviceCatalog.js';
import type { DeviceDefinition } from '../../src/device/DeviceDefinition.js';

describe(
  'DeviceCatalog',
  () => {

    it(
      'registers definitions',
      () => {

        const catalog =
          new DeviceCatalog();

        const definition =
          {} as DeviceDefinition;

        catalog.register(
          'device',
          definition,
        );

        expect(
          catalog.has(
            'device',
          ),
        ).toBe(
          true,
        );

        expect(
          catalog.get(
            'device',
          ),
        ).toBe(
          definition,
        );

      },
    );

    it(
      'returns all ids',
      () => {

        const catalog =
          new DeviceCatalog();

        catalog.register(
          'a',
          {} as DeviceDefinition,
        );

        catalog.register(
          'b',
          {} as DeviceDefinition,
        );

        expect(
          catalog.ids(),
        ).toEqual([
          'a',
          'b',
        ]);

      },
    );

    it(
      'removes definitions',
      () => {

        const catalog =
          new DeviceCatalog();

        catalog.register(
          'device',
          {} as DeviceDefinition,
        );

        expect(
          catalog.remove(
            'device',
          ),
        ).toBe(
          true,
        );

        expect(
          catalog.has(
            'device',
          ),
        ).toBe(
          false,
        );

      },
    );

    it(
      'throws for unknown definitions',
      () => {

        const catalog =
          new DeviceCatalog();

        expect(
          () =>
            catalog.get(
              'missing',
            ),
        ).toThrow(
          'Unknown device definition: missing',
        );

      },
    );

    it(
      'rejects duplicate ids',
      () => {

        const catalog =
          new DeviceCatalog();

        catalog.register(
          'device',
          {} as DeviceDefinition,
        );

        expect(
          () =>
            catalog.register(
              'device',
              {} as DeviceDefinition,
            ),
        ).toThrow(
          'Device definition already registered: device',
        );

      },
    );

  },
);