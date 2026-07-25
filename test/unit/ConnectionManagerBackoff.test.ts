import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { ModbusClient } from '../../src/client/ModbusClient.js';
import { ConnectionManager } from '../../src/proxy/ConnectionManager.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';
import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';

describe(
  'ConnectionManager reconnect backoff',
  () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it(
      'increases the reconnect delay after each failed attempt',
      async () => {
        vi.useFakeTimers();

        const device: ManagedDevice = {
          id: 'device-1',
          name: 'Test Device',
          host: '127.0.0.1',
          port: 502,
          unitId: 1,
        };

        const runtime =
          new ManagedDeviceRuntime(
            device,
          );

        let disconnectedCallback:
          | ((
              error?: Error,
            ) => void)
          | undefined;

        const connectMock =
          vi.fn<
            () => Promise<void>
          >();

        connectMock
          .mockResolvedValueOnce(
            undefined,
          )
          .mockRejectedValue(
            new Error(
              'Connection refused.',
            ),
          );

        const disconnectMock =
          vi.fn();

        const client = {
          connect: connectMock,

          disconnect:
            disconnectMock,

          onDisconnected: (
            callback: (
              error?: Error,
            ) => void,
          ): void => {
            disconnectedCallback =
              callback;
          },
        } as unknown as ModbusClient;

        const manager =
          new ConnectionManager(
            runtime,
            client,
          );

        await manager.connect();

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(1);

        disconnectedCallback?.(
          new Error(
            'Connection lost.',
          ),
        );

        /*
         * First retry after 250 ms.
         */
        await vi.advanceTimersByTimeAsync(
          249,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(
          1,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(2);

        /*
         * Second retry after an additional 500 ms.
         */
        await vi.advanceTimersByTimeAsync(
          499,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(
          1,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(3);

        /*
         * Third retry after an additional 1000 ms.
         */
        await vi.advanceTimersByTimeAsync(
          999,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(3);

        await vi.advanceTimersByTimeAsync(
          1,
        );

        expect(
          connectMock,
        ).toHaveBeenCalledTimes(4);

        manager.disconnect();
      },
    );
  },
);