import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PollingScheduler } from '../../src/polling/PollingScheduler.js';

describe(
  'PollingSchedulerStartStop',
  () => {
    it(
      'starts all polling tasks',
      async () => {
        vi.useFakeTimers();

        const execute =
          vi.fn().mockResolvedValue(undefined);

        const scheduler =
          new PollingScheduler();

        scheduler.addTask({
          id: 'task',
          intervalMs: 100,
          task: {
            execute,
          },
        });

        scheduler.start();

        await vi.advanceTimersByTimeAsync(350);

        expect(
          execute,
        ).toHaveBeenCalledTimes(3);

        scheduler.stop();

        vi.useRealTimers();
      },
    );

    it(
      'stops all polling tasks',
      async () => {
        vi.useFakeTimers();

        const execute =
          vi.fn().mockResolvedValue(undefined);

        const scheduler =
          new PollingScheduler();

        scheduler.addTask({
          id: 'task',
          intervalMs: 100,
          task: {
            execute,
          },
        });

        scheduler.start();

        await vi.advanceTimersByTimeAsync(250);

        scheduler.stop();

        const count =
          execute.mock.calls.length;

        await vi.advanceTimersByTimeAsync(500);

        expect(
          execute.mock.calls.length,
        ).toBe(count);

        vi.useRealTimers();
      },
    );
  },
);