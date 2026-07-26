import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { DeviceDefinition } from '../../src/device/DeviceDefinition.js';
import { DeviceRegistry } from '../../src/device/DeviceRegistry.js';
import type { ManagedDevice } from '../../src/device/ManagedDevice.js';
import type { DeviceFactory } from '../../src/model/DeviceFactory.js';

describe(
  'DeviceRegistry',
  () => {

    it(
      'creates and registers a device',
      () => {

        const device =
          {} as ManagedDevice;

        const create =
          vi.fn(
            () => device,
          );

        const factory = {

          create,

        } as unknown as DeviceFactory;

        const registry =
          new DeviceRegistry(
            factory,
          );

        const definition =
          {} as DeviceDefinition;

        const result =
          registry.register(
            'device-1',
            definition,
          );

        expect(
          result,
        ).toBe(
          device,
        );

        expect(
          create,
        ).toHaveBeenCalledWith(
          definition,
        );

        expect(
          registry.has(
            'device-1',
          ),
        ).toBe(
          true,
        );

        expect(
          registry.get(
            'device-1',
          ),
        ).toBe(
          device,
        );

      },
    );

    it(
      'returns all ids',
      () => {

        const factory = {

          create: vi
            .fn()
            .mockReturnValueOnce(
              {} as ManagedDevice,
            )
            .mockReturnValueOnce(
              {} as ManagedDevice,
            ),

        } as unknown as DeviceFactory;

        const registry =
          new DeviceRegistry(
            factory,
          );

        registry.register(
          'a',
          {} as DeviceDefinition,
        );

        registry.register(
          'b',
          {} as DeviceDefinition,
        );

        expect(
          registry.ids(),
        ).toEqual([
          'a',
          'b',
        ]);

      },
    );

    it(
      'removes devices',
      () => {

        const factory = {

          create:
            vi.fn(
              () => ({} as ManagedDevice),
            ),

        } as unknown as DeviceFactory;

        const registry =
          new DeviceRegistry(
            factory,
          );

        registry.register(
          'device',
          {} as DeviceDefinition,
        );

        expect(
          registry.remove(
            'device',
          ),
        ).toBe(
          true,
        );

        expect(
          registry.has(
            'device',
          ),
        ).toBe(
          false,
        );

      },
    );

    it(
      'throws for unknown devices',
      () => {

        const factory = {

          create:
            vi.fn(),

        } as unknown as DeviceFactory;

        const registry =
          new DeviceRegistry(
            factory,
          );

        expect(
          () =>
            registry.get(
              'missing',
            ),
        ).toThrow(
          'Unknown device: missing',
        );

      },
    );

    it(
      'rejects duplicate device ids',
      () => {

        const factory = {

          create:
            vi.fn(
              () => ({} as ManagedDevice),
            ),

        } as unknown as DeviceFactory;

        const registry =
          new DeviceRegistry(
            factory,
          );

        registry.register(
          'device',
          {} as DeviceDefinition,
        );

        expect(
          () =>
            registry.register(
              'device',
              {} as DeviceDefinition,
            ),
        ).toThrow(
          'Device already registered: device',
        );

      },
    );

  },
);