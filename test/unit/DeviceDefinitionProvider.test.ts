import {
  describe,
  expect,
  it,
} from 'vitest';

import type { DeviceDefinition } from '../../src/device/DeviceDefinition.js';
import { DeviceDefinitionProvider } from '../../src/device/DeviceDefinitionProvider.js';

describe(
  'DeviceDefinitionProvider',
  () => {

    it(
      'registers definitions',
      () => {

        const provider =
          new DeviceDefinitionProvider();

        const definition =
          {} as DeviceDefinition;

        provider.register(
          'solaredge',
          definition,
        );

        expect(
          provider.has(
            'solaredge',
          ),
        ).toBe(
          true,
        );

        expect(
          provider.get(
            'solaredge',
          ),
        ).toBe(
          definition,
        );

      },
    );

    it(
      'returns registered types',
      () => {

        const provider =
          new DeviceDefinitionProvider();

        provider.register(
          'growatt',
          {} as DeviceDefinition,
        );

        provider.register(
          'kostal',
          {} as DeviceDefinition,
        );

        expect(
          provider.types(),
        ).toEqual([
          'growatt',
          'kostal',
        ]);

      },
    );

    it(
      'throws for unknown types',
      () => {

        const provider =
          new DeviceDefinitionProvider();

        expect(
          () =>
            provider.get(
              'unknown',
            ),
        ).toThrow(
          'Unknown device type: unknown',
        );

      },
    );

    it(
      'rejects duplicate types',
      () => {

        const provider =
          new DeviceDefinitionProvider();

        provider.register(
          'solaredge',
          {} as DeviceDefinition,
        );

        expect(
          () =>
            provider.register(
              'solaredge',
              {} as DeviceDefinition,
            ),
        ).toThrow(
          'Device type already registered: solaredge',
        );

      },
    );

  },
);