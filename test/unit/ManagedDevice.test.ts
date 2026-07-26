import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ManagedDevice } from '../../src/device/ManagedDevice.js';
import type { DeviceReader } from '../../src/device/DeviceReader.js';
import type { DeviceWriter } from '../../src/device/DeviceWriter.js';

describe(
  'ManagedDevice',
  () => {

    it(
      'reads a property',
      async () => {

        const reader = {
          read: vi.fn(
            async () => 123,
          ),
        } as unknown as DeviceReader;

        const writer = {
          write: vi.fn(),
        } as unknown as DeviceWriter;

        const device =
          new ManagedDevice(
            reader,
            writer,
          );

        await expect(
          device.read(
            'power',
          ),
        ).resolves.toBe(123);

        expect(
          reader.read,
        ).toHaveBeenCalledWith(
          'power',
        );

      },
    );

    it(
      'writes a property',
      async () => {

        const reader = {
          read: vi.fn(),
        } as unknown as DeviceReader;

        const writer = {
          write: vi.fn(
            async () => undefined,
          ),
        } as unknown as DeviceWriter;

        const device =
          new ManagedDevice(
            reader,
            writer,
          );

        await device.write(
          'powerLimit',
          80,
        );

        expect(
          writer.write,
        ).toHaveBeenCalledWith(
          'powerLimit',
          80,
        );

      },
    );

  },
);