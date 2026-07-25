import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { ModbusPollingClient } from '../../src/polling/ModbusPollingClient.js';
import { PollFunction } from '../../src/polling/PollFunction.js';
import { RegisterPollingTask } from '../../src/polling/RegisterPollingTask.js';

describe(
  'RegisterPollingTask',
  () => {
    function createClient():
      ModbusPollingClient {

      return {
        readCoils:
          vi.fn().mockResolvedValue([]),

        readDiscreteInputs:
          vi.fn().mockResolvedValue([]),

        readHoldingRegisters:
          vi.fn().mockResolvedValue(
            new Uint16Array(),
          ),

        readInputRegisters:
          vi.fn().mockResolvedValue(
            new Uint16Array(),
          ),
      };
    }

    it(
      'reads holding registers',
      async () => {
        const client =
          createClient();

        const task =
          new RegisterPollingTask(
            client,
            PollFunction.ReadHoldingRegisters,
            1,
            100,
            10,
          );

        await task.execute();

        expect(
          client.readHoldingRegisters,
        ).toHaveBeenCalledWith(
          1,
          100,
          10,
        );
      },
    );

    it(
      'reads input registers',
      async () => {
        const client =
          createClient();

        const task =
          new RegisterPollingTask(
            client,
            PollFunction.ReadInputRegisters,
            1,
            100,
            10,
          );

        await task.execute();

        expect(
          client.readInputRegisters,
        ).toHaveBeenCalled();
      },
    );

    it(
      'reads coils',
      async () => {
        const client =
          createClient();

        const task =
          new RegisterPollingTask(
            client,
            PollFunction.ReadCoils,
            1,
            100,
            10,
          );

        await task.execute();

        expect(
          client.readCoils,
        ).toHaveBeenCalled();
      },
    );

    it(
      'reads discrete inputs',
      async () => {
        const client =
          createClient();

        const task =
          new RegisterPollingTask(
            client,
            PollFunction.ReadDiscreteInputs,
            1,
            100,
            10,
          );

        await task.execute();

        expect(
          client.readDiscreteInputs,
        ).toHaveBeenCalled();
      },
    );
  },
);