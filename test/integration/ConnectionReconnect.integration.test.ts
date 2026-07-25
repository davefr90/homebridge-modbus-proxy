import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ConnectionManager } from '../../src/proxy/ConnectionManager.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';
import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe(
  'ConnectionManager reconnect',
  () => {
    let server: FakeModbusServer;
    let manager: ConnectionManager;
    let runtime: ManagedDeviceRuntime;

    beforeEach(async () => {
      server = new FakeModbusServer();

      await server.start();

      const device: ManagedDevice = {
        id: 'device-1',
        name: 'Test Device',
        host: '127.0.0.1',
        port: server.port,
        unitId: 1,
      };

      runtime =
        new ManagedDeviceRuntime(
          device,
        );

      manager =
        new ConnectionManager(
          runtime,
        );

      await manager.connect();
    });

    afterEach(async () => {
      vi.useRealTimers();

      manager.disconnect();

      await server.stop();
    });

    it(
      'is connected after connect()',
      () => {
        expect(
          runtime.connected,
        ).toBe(true);

        expect(
          manager.isConnected(),
        ).toBe(true);
      },
    );

    it(
      'marks the runtime as disconnected when the server closes the connection',
      async () => {
        await server.stop();

        await vi.waitFor(
          () => {
            expect(
              runtime.connected,
            ).toBe(false);
          },
          {
            timeout: 1000,
          },
        );

        expect(
          manager.isConnected(),
        ).toBe(false);
      },
    );

    it(
      'automatically reconnects when the server becomes available again',
      async () => {
        const port =
          server.port;

        await server.stop();

        await vi.waitFor(
          () => {
            expect(
              runtime.connected,
            ).toBe(false);
          },
          {
            timeout: 1000,
          },
        );

        await server.start(
          port,
        );

        await vi.waitFor(
          () => {
            expect(
              runtime.connected,
            ).toBe(true);
          },
          {
            timeout: 2000,
          },
        );

        expect(
          manager.isConnected(),
        ).toBe(true);

        expect(
          runtime.lastError,
        ).toBeUndefined();
      },
    );

    it(
      'reconnects after multiple failed reconnect attempts',
      async () => {
        const port =
          server.port;

        await server.stop();

        await vi.waitFor(
          () => {
            expect(
              runtime.connected,
            ).toBe(false);
          },
          {
            timeout: 1000,
          },
        );

        /*
         * Keep the server offline long enough for the
         * reconnect attempts after 250 ms and 500 ms
         * to fail.
         */
        await new Promise<void>(
          (resolve) => {
            setTimeout(
              resolve,
              850,
            );
          },
        );

        expect(
          runtime.connected,
        ).toBe(false);

        expect(
          runtime.lastError,
        ).toBeInstanceOf(
          Error,
        );

        await server.start(
          port,
        );

        /*
         * The next reconnect attempt uses a delay of
         * 1000 ms and should restore the connection.
         */
        await vi.waitFor(
          () => {
            expect(
              runtime.connected,
            ).toBe(true);
          },
          {
            timeout: 2000,
            interval: 25,
          },
        );

        expect(
          manager.isConnected(),
        ).toBe(true);

        expect(
          runtime.lastSeen,
        ).toBeInstanceOf(
          Date,
        );

        expect(
          runtime.lastError,
        ).toBeUndefined();
      },
    );
  },
);