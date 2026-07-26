import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import { DeviceWriter } from '../../src/device/DeviceWriter.js';
import type { RegisterWriter } from '../../src/model/RegisterWriter.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'DeviceWriter',
  () => {

    it(
      'writes a logical device property',
      async () => {

        const map =
          new DeviceRegisterMap();

        const definition = {
          unitId: 1,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 10,
          length: 1,
          dataType:
            RegisterDataType.Uint16,
          name: 'Power',
        };

        map.add(
          'power',
          definition,
        );

        const write =
          vi.fn(
            async () => undefined,
          );

        const registerWriter = {
          write,
        } as unknown as RegisterWriter;

        const writer =
          new DeviceWriter(
            map,
            registerWriter,
          );

        await writer.write(
          'power',
          123,
        );

        expect(
          write,
        ).toHaveBeenCalledWith(
          definition,
          123,
        );

      },
    );

    it(
      'throws for unknown properties',
      async () => {

        const writer =
          new DeviceWriter(
            new DeviceRegisterMap(),
            {
              write: vi.fn(),
            } as unknown as RegisterWriter,
          );

        await expect(
          writer.write(
            'unknown',
            1,
          ),
        ).rejects.toThrow(
          'Unknown device property: unknown',
        );

      },
    );

  },
);