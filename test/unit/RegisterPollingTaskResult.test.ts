import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  ModbusPollingClient,
} from '../../src/polling/ModbusPollingClient.js';

import {
  PollFunction,
} from '../../src/polling/PollFunction.js';

import {
  RegisterPollingTask,
} from '../../src/polling/RegisterPollingTask.js';

describe(
  'RegisterPollingTaskResult',
  () => {
    it(
      'returns a poll result',
      async () => {
        const values =
          new Uint16Array([
            10,
            20,
            30,
          ]);

        const client:
          ModbusPollingClient = {
            readCoils:
              vi.fn().mockResolvedValue([]),

            readDiscreteInputs:
              vi.fn().mockResolvedValue([]),

            readHoldingRegisters:
              vi.fn().mockResolvedValue(
                values,
              ),

            readInputRegisters:
              vi.fn().mockResolvedValue(
                new Uint16Array(),
              ),
          };

        const task =
          new RegisterPollingTask(
            client,
            PollFunction.ReadHoldingRegisters,
            1,
            100,
            3,
          );

        const result =
          await task.execute();

        expect(
          result.unitId,
        ).toBe(1);

        expect(
          result.functionCode,
        ).toBe(
          PollFunction.ReadHoldingRegisters,
        );

        expect(
          result.startAddress,
        ).toBe(100);

        expect(
          result.quantity,
        ).toBe(3);

        expect(
          result.values,
        ).toBe(values);

        expect(
          result.startedAt,
        ).toBeInstanceOf(Date);

        expect(
          result.completedAt,
        ).toBeInstanceOf(Date);

        expect(
          result.completedAt.getTime(),
        ).toBeGreaterThanOrEqual(
          result.startedAt.getTime(),
        );

        expect(
          result.durationMs,
        ).toBeGreaterThanOrEqual(0);

        expect(
          client.readHoldingRegisters,
        ).toHaveBeenCalledWith(
          1,
          100,
          3,
        );
      },
    );
  },
);