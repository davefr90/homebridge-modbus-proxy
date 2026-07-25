import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterCache } from '../../src/polling/RegisterCache.js';

describe(
  'RegisterCache',
  () => {
    it(
      'stores register values',
      () => {
        const cache =
          new RegisterCache();

        const values =
          new Uint16Array([
            10,
            20,
            30,
          ]);

        cache.store(
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
      'returns undefined for unknown registers',
      () => {
        const cache =
          new RegisterCache();

        expect(
          cache.read(
            1,
            100,
            1,
          ),
        ).toBeUndefined();
      },
    );

    it(
      'updates existing values',
      () => {
        const cache =
          new RegisterCache();

        cache.store(
          1,
          100,
          new Uint16Array([
            1,
          ]),
        );

        cache.store(
          1,
          100,
          new Uint16Array([
            2,
          ]),
        );

        expect(
          cache.read(
            1,
            100,
            1,
          ),
        ).toEqual(
          new Uint16Array([
            2,
          ]),
        );
      },
    );

    it(
      'reports a new value as changed',
      () => {
        const cache =
          new RegisterCache();

        const changed =
          cache.store(
            1,
            100,
            new Uint16Array([
              10,
            ]),
          );

        expect(changed).toBe(true);
      },
    );

    it(
      'reports identical values as unchanged',
      () => {
        const cache =
          new RegisterCache();

        cache.store(
          1,
          100,
          new Uint16Array([
            10,
            20,
          ]),
        );

        const changed =
          cache.store(
            1,
            100,
            new Uint16Array([
              10,
              20,
            ]),
          );

        expect(changed).toBe(false);
      },
    );

    it(
      'reports modified values as changed',
      () => {
        const cache =
          new RegisterCache();

        cache.store(
          1,
          100,
          new Uint16Array([
            10,
            20,
          ]),
        );

        const changed =
          cache.store(
            1,
            100,
            new Uint16Array([
              10,
              21,
            ]),
          );

        expect(changed).toBe(true);
      },
    );
  },
);