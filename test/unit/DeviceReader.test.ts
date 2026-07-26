import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { DeviceReader } from '../../src/device/DeviceReader.js';
import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import type { RegisterReader } from '../../src/model/RegisterReader.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'DeviceReader',
  () => {

    it(
      'reads a logical device property',
      async () => {

        const map =
          new DeviceRegisterMap();

        const definition = {
          unitId: 1,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 100,
          length: 1,
          dataType:
            RegisterDataType.Uint16,
          name: 'Power',
        };

        map.add(
          'power',
          definition,
        );

        const read =
          vi.fn(
            async () => 123,
          );

        const registerReader = {
          read,
        } as unknown as RegisterReader;

        const reader =
          new DeviceReader(
            map,
            registerReader,
          );

        await expect(
          reader.read(
            'power',
          ),
        ).resolves.toBe(123);

        expect(
          read,
        ).toHaveBeenCalledWith(
          definition,
        );

      },
    );

    it(
      'throws for unknown properties',
      async () => {

        const reader =
          new DeviceReader(
            new DeviceRegisterMap(),
            {
              read: vi.fn(),
            } as unknown as RegisterReader,
          );

        await expect(
          reader.read(
            'unknown',
          ),
        ).rejects.toThrow(
          'Unknown device property: unknown',
        );

      },
    );

  },
);