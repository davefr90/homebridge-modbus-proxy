import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { DevicePoller } from '../../src/polling/DevicePoller.js';
import type { PollingTask } from '../../src/polling/PollingTask.js';

describe(
  'DevicePoller',
  () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    function createTask(): {
      task: PollingTask;
      execute: ReturnType<typeof vi.fn>;
    } {
      const execute =
        vi.fn().mockResolvedValue(undefined);

      return {
        execute,
        task: {
          execute,
        },
      };
    }

    it(
      'is stopped after creation',
      () => {
        const { task } =
          createTask();

        const poller =
          new DevicePoller(task);

        expect(
          poller.isRunning(),
        ).toBe(false);
      },
    );

    it(
      'starts polling',
      () => {
        const { task } =
          createTask();

        const poller =
          new DevicePoller(task);

        poller.start();

        expect(
          poller.isRunning(),
        ).toBe(true);
      },
    );

    it(
      'stops polling',
      () => {
        const { task } =
          createTask();

        const poller =
          new DevicePoller(task);

        poller.start();
        poller.stop();

        expect(
          poller.isRunning(),
        ).toBe(false);
      },
    );

    it(
      'executes the polling task periodically',
      async () => {
        vi.useFakeTimers();

        const {
          task,
          execute,
        } =
          createTask();

        const poller =
          new DevicePoller(
            task,
            100,
          );

        poller.start();

        await vi.advanceTimersByTimeAsync(
          350,
        );

        expect(
          execute,
        ).toHaveBeenCalledTimes(3);
      },
    );

    it(
      'does not create multiple timers',
      async () => {
        vi.useFakeTimers();

        const {
          task,
          execute,
        } =
          createTask();

        const poller =
          new DevicePoller(
            task,
            100,
          );

        poller.start();
        poller.start();
        poller.start();

        await vi.advanceTimersByTimeAsync(
          300,
        );

        expect(
          execute,
        ).toHaveBeenCalledTimes(3);
      },
    );

    it(
      'stops executing after stop',
      async () => {
        vi.useFakeTimers();

        const {
          task,
          execute,
        } =
          createTask();

        const poller =
          new DevicePoller(
            task,
            100,
          );

        poller.start();

        await vi.advanceTimersByTimeAsync(
          250,
        );

        poller.stop();

        await vi.advanceTimersByTimeAsync(
          1000,
        );

        expect(
          execute,
        ).toHaveBeenCalledTimes(2);
      },
    );

    it(
      'does not execute overlapping polling tasks',
      async () => {
        vi.useFakeTimers();

        let active = 0;
        let maximumParallelExecutions = 0;

        const task: PollingTask = {
          async execute() {
            active++;

            maximumParallelExecutions =
              Math.max(
                maximumParallelExecutions,
                active,
              );

            await new Promise<void>(
              (resolve) => {
                setTimeout(
                  resolve,
                  250,
                );
              },
            );

            active--;
          },
        };

        const poller =
          new DevicePoller(
            task,
            100,
          );

        poller.start();

        await vi.advanceTimersByTimeAsync(
          1000,
        );

        poller.stop();

        expect(
          maximumParallelExecutions,
        ).toBe(1);
      },
    );
  },
);