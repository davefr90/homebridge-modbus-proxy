import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  NormalizedModbusTcpProxyPlatformConfiguration,
} from '../../src/config/ModbusTcpProxyPlatformConfiguration.js';

import type {
  Logger,
} from '../../src/logging/Logger.js';

import {
  ModbusTcpProxyRuntime,
} from '../../src/runtime/ModbusTcpProxyRuntime.js';

/**
 * Creates a logger whose methods can be inspected.
 */
function createLogger() {

  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } satisfies Logger;

}

describe(
  'ModbusTcpProxyRuntime',
  () => {

    const configuration:
      NormalizedModbusTcpProxyPlatformConfiguration = {
        targetHost: '192.168.2.101',
        targetPort: 502,
        listenHost: '0.0.0.0',
        listenPort: 1502,
      };

    it(
      'owns the shared target connection and proxy listener',
      async () => {

        let connected =
          false;

        let running =
          false;

        const connection = {
          connect: vi.fn()
            .mockImplementation(
              async () => {
                connected = true;
              },
            ),
          disconnect: vi.fn()
            .mockImplementation(
              () => {
                connected = false;
              },
            ),
          isConnected: vi.fn()
            .mockImplementation(
              () => connected,
            ),
        };

        const server = {
          get isRunning() {
            return running;
          },
          get port() {
            return 1502;
          },
          get sessionCount() {
            return running
              ? 3
              : 0;
          },
          start: vi.fn()
            .mockImplementation(
              async () => {
                running = true;
              },
            ),
          stop: vi.fn()
            .mockImplementation(
              async () => {
                running = false;
              },
            ),
        };

        const componentsFactory =
          vi.fn()
            .mockReturnValue({
              connection,
              server,
            });

        const logger =
          createLogger();

        const runtime =
          new ModbusTcpProxyRuntime(
            configuration,
            logger,
            componentsFactory,
          );

        expect(
          componentsFactory,
        ).toHaveBeenCalledWith(
          {
            id: 'homebridge-modbus-proxy-target',
            name: 'Modbus TCP Proxy Target',
            host: '192.168.2.101',
            port: 502,
            unitId: 1,
          },
          logger,
        );

        await runtime.start();
        await runtime.start();

        expect(
          connection.connect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          server.start,
        ).toHaveBeenCalledWith(
          1502,
          '0.0.0.0',
        );

        expect(
          runtime.status(),
        ).toEqual({
          running: true,
          targetConnected: true,
          listeningPort: 1502,
          clientCount: 3,
        });

        expect(
          logger.info,
        ).toHaveBeenCalledWith(
          'Modbus TCP proxy listening on 0.0.0.0:1502 and forwarding to 192.168.2.101:502.',
        );

        await runtime.stop();
        await runtime.stop();

        expect(
          server.stop,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          connection.disconnect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          runtime.status(),
        ).toEqual({
          running: false,
          targetConnected: false,
          listeningPort: undefined,
          clientCount: 0,
        });

      },
    );

    it(
      'cleans up a connected target after a listener start error',
      async () => {

        let connected =
          false;

        const error =
          new Error(
            'Address already in use.',
          );

        const connection = {
          connect: vi.fn()
            .mockImplementation(
              async () => {
                connected = true;
              },
            ),
          disconnect: vi.fn()
            .mockImplementation(
              () => {
                connected = false;
              },
            ),
          isConnected: vi.fn()
            .mockImplementation(
              () => connected,
            ),
        };

        const server = {
          isRunning: false,
          port: 1502,
          sessionCount: 0,
          start: vi.fn()
            .mockRejectedValue(
              error,
            ),
          stop: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
        };

        const logger =
          createLogger();

        const runtime =
          new ModbusTcpProxyRuntime(
            configuration,
            logger,
            () => ({
              connection,
              server,
            }),
          );

        await expect(
          runtime.start(),
        ).rejects.toBe(
          error,
        );

        expect(
          server.stop,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          connection.disconnect,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          logger.error,
        ).toHaveBeenCalledWith(
          'Unable to start Modbus TCP proxy.',
          error,
        );

      },
    );

  },
);
