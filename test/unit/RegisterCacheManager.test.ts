import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterCache } from '../../src/polling/RegisterCache.js';
import { RegisterCacheManager } from '../../src/polling/RegisterCacheManager.js';

describe(
  'RegisterCacheManager',
  () => {
    it(
      'stores poll results',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const values =
          new Uint16Array([
            10,
            20,
            30,
          ]);

        manager.store(
          1,
          100,
          values,
        );

        expect(
          cache.read(
            1,
            100,
            3,
          ),
        ).toEqual(values);
      },
    );

    it(
      'returns whether values changed',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        expect(
          manager.store(
            1,
            100,
            new Uint16Array([
              1,
            ]),
          ),
        ).toBe(true);

        expect(
          manager.store(
            1,
            100,
            new Uint16Array([
              1,
            ]),
          ),
        ).toBe(false);

        expect(
          manager.store(
            1,
            100,
            new Uint16Array([
              2,
            ]),
          ),
        ).toBe(true);
      },
    );
  },
);