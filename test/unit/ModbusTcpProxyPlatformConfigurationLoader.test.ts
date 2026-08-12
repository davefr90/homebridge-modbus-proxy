import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  ModbusTcpProxyPlatformConfigurationLoader,
} from '../../src/config/ModbusTcpProxyPlatformConfigurationLoader.js';

describe(
  'ModbusTcpProxyPlatformConfigurationLoader',
  () => {

    const loader =
      new ModbusTcpProxyPlatformConfigurationLoader();

    it(
      'keeps the TCP proxy disabled when no section exists',
      () => {

        expect(
          loader.load(
            undefined,
          ),
        ).toBeUndefined();

      },
    );

    it(
      'applies safe defaults to a configured target',
      () => {

        const configuration =
          loader.load({
            targetHost:
              ' 192.168.2.101 ',
          });

        expect(
          configuration,
        ).toEqual({
          targetHost: '192.168.2.101',
          targetPort: 502,
          listenHost: '0.0.0.0',
          listenPort: 1502,
        });

        expect(
          Object.isFrozen(
            configuration,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'accepts explicit target and listener settings',
      () => {

        expect(
          loader.load({
            targetHost: 'solaredge.local',
            targetPort: 1503,
            listenHost: '127.0.0.1',
            listenPort: 2502,
          }),
        ).toEqual({
          targetHost: 'solaredge.local',
          targetPort: 1503,
          listenHost: '127.0.0.1',
          listenPort: 2502,
        });

      },
    );

    it(
      'rejects malformed sections and hosts',
      () => {

        expect(
          () =>
            loader.load(
              'invalid',
            ),
        ).toThrow(
          'Modbus TCP proxy configuration must be an object.',
        );

        expect(
          () =>
            loader.load({}),
        ).toThrow(
          'Modbus TCP proxy target host must be a string.',
        );

        expect(
          () =>
            loader.load({
              targetHost: ' ',
            }),
        ).toThrow(
          'Modbus TCP proxy target host must not be empty.',
        );

        expect(
          () =>
            loader.load({
              targetHost: '127.0.0.1',
              listenHost: '',
            }),
        ).toThrow(
          'Modbus TCP proxy listen host must not be empty.',
        );

      },
    );

    it(
      'rejects invalid target and listener ports',
      () => {

        expect(
          () =>
            loader.load({
              targetHost: '127.0.0.1',
              targetPort: 0,
            }),
        ).toThrow(
          'Modbus TCP proxy target port must be an integer between 1 and 65535.',
        );

        expect(
          () =>
            loader.load({
              targetHost: '127.0.0.1',
              listenPort: 65536,
            }),
        ).toThrow(
          'Modbus TCP proxy listen port must be an integer between 1 and 65535.',
        );

      },
    );

  },
);
