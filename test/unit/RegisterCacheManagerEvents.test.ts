import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { RegisterCache } from '../../src/polling/RegisterCache.js';
import {
  RegisterCacheManager,
} from '../../src/polling/RegisterCacheManager.js';

describe(
  'RegisterCacheManager events',
  () => {
    it(
      'notifies listeners when values change',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const listener =
          vi.fn();

        manager.onChanged(
          listener,
        );

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          listener,
        ).toHaveBeenCalledWith({
          unitId: 1,
          startAddress: 100,
          values: new Uint16Array([
            10,
          ]),
        });
      },
    );

    it(
      'does not notify listeners if nothing changed',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const listener =
          vi.fn();

        manager.onChanged(
          listener,
        );

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        listener.mockClear();

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        expect(
          listener,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'notifies multiple listeners',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const firstListener =
          vi.fn();

        const secondListener =
          vi.fn();

        manager.onChanged(
          firstListener,
        );

        manager.onChanged(
          secondListener,
        );

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        expect(
          firstListener,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          secondListener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      'removes listeners',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const listener =
          vi.fn();

        manager.onChanged(
          listener,
        );

        manager.offChanged(
          listener,
        );

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        expect(
          listener,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'does not register the same listener twice',
      () => {
        const cache =
          new RegisterCache();

        const manager =
          new RegisterCacheManager(
            cache,
          );

        const listener =
          vi.fn();

        manager.onChanged(
          listener,
        );

        manager.onChanged(
          listener,
        );

        manager.store(
          1,
          100,
          new Uint16Array([
            10,
          ]),
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);