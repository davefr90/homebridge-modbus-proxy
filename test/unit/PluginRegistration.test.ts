import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  API,
} from 'homebridge';

import initializePlugin from '../../src/index.js';

import {
  ModbusProxyPlatform,
} from '../../src/platform.js';

describe(
  'Plugin registration',
  () => {

    it(
      'registers the real plugin and platform identifiers',
      () => {

        const registerPlatform =
          vi.fn();

        initializePlugin({
          registerPlatform,
        } as unknown as API);

        expect(
          registerPlatform,
        ).toHaveBeenCalledWith(
          'homebridge-modbus-proxy',
          'ModbusProxy',
          ModbusProxyPlatform,
        );

      },
    );

  },
);
