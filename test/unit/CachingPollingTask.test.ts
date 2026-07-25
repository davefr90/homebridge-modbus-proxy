import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { PollResult } from '../../src/polling/PollResult.js';
import type { PollingTask } from '../../src/polling/PollingTask.js';
import { CachingPollingTask } from '../../src/polling/CachingPollingTask.js';
import { RegisterCache } from '../../src/polling/RegisterCache.js';
import { RegisterCacheManager } from '../../src/polling/RegisterCacheManager.js';

describe(
  'CachingPollingTask',
  () => {
    it(
      'stores the poll result in the cache',
      async () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const task:
          PollingTask<PollResult> = {
          execute: vi
            .fn()
            .mockResolvedValue({
              unitId: 1,
              startAddress: 100,
              values: new Uint16Array([
                10,
                20,
              ]),
            }),
        };

        const cachingTask =
          new CachingPollingTask(
            task,
            manager,
          );

        await cachingTask.execute();

        expect(
          cache.read(
            1,
            100,
            2,
          ),
        ).toEqual(
          new Uint16Array([
            10,
            20,
          ]),
        );
      },
    );

    it(
      'returns the original poll result',
      async () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const result: PollResult = {
          unitId: 1,
          startAddress: 100,
          values: new Uint16Array([
            5,
          ]),
        };

        const task:
          PollingTask<PollResult> = {
          execute: vi
            .fn()
            .mockResolvedValue(
              result,
            ),
        };

        const cachingTask =
          new CachingPollingTask(
            task,
            manager,
          );

        await expect(
          cachingTask.execute(),
        ).resolves.toBe(
          result,
        );
      },
    );
  },
);