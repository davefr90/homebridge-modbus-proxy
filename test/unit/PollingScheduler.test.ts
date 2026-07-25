import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PollingScheduler } from '../../src/polling/PollingScheduler.js';

describe(
  'PollingScheduler',
  () => {
    it(
      'adds and removes tasks',
      () => {
        const scheduler =
          new PollingScheduler();

        scheduler.addTask({
          id: 'task-1',
          intervalMs: 1000,
          task: {
            execute:
              vi.fn(),
          },
        });

        expect(
          scheduler.getTaskCount(),
        ).toBe(1);

        expect(
          scheduler.hasTask('task-1'),
        ).toBe(true);

        expect(
          scheduler.removeTask('task-1'),
        ).toBe(true);

        expect(
          scheduler.getTaskCount(),
        ).toBe(0);
      },
    );
  },
);