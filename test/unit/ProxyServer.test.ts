import { Socket } from 'node:net';

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ConnectionManager } from '../../src/proxy/ConnectionManager.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';
import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';
import { ProxyServer } from '../../src/proxy/ProxyServer.js';

/**
 * Opens a TCP client connection to the proxy server.
 */
function connectClient(
  port: number,
): Promise<Socket> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const socket = new Socket();

      const handleConnect = (): void => {
        socket.removeListener(
          'error',
          handleError,
        );

        resolve(socket);
      };

      const handleError = (
        error: Error,
      ): void => {
        socket.removeListener(
          'connect',
          handleConnect,
        );

        socket.destroy();
        reject(error);
      };

      socket.once(
        'connect',
        handleConnect,
      );

      socket.once(
        'error',
        handleError,
      );

      socket.connect(
        port,
        '127.0.0.1',
      );
    },
  );
}

/**
 * Waits until the next event-loop cycle.
 */
function waitForEventLoop(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

describe('ProxyServer', () => {
  const device: ManagedDevice = {
    id: 'device-1',
    name: 'Test Device',
    host: '127.0.0.1',
    port: 502,
    unitId: 1,
  };

  let server:
    | ProxyServer
    | undefined;

  let connectionManager:
    | ConnectionManager
    | undefined;

  const clients: Socket[] = [];

  afterEach(async () => {
    for (const client of clients) {
      if (!client.destroyed) {
        client.destroy();
      }
    }

    clients.length = 0;

    if (server !== undefined) {
      await server.stop();
    }

    if (connectionManager !== undefined) {
      connectionManager.disconnect();
    }

    vi.restoreAllMocks();

    server = undefined;
    connectionManager = undefined;
  });

  async function createConnectedServer(): Promise<ProxyServer> {
    const client =
      new ModbusClient(
        device.host,
        device.port,
      );

    vi.spyOn(
      client,
      'connect',
    ).mockResolvedValue();

    vi.spyOn(
      client,
      'disconnect',
    ).mockImplementation(() => {});

    connectionManager =
      new ConnectionManager(
        new ManagedDeviceRuntime(device),
        client,
      );

    await connectionManager.connect();

    server =
      new ProxyServer(
        connectionManager,
      );

    return server;
  }

  it('rejects starting without a target connection', async () => {
    const client =
      new ModbusClient(
        device.host,
        device.port,
      );

    connectionManager =
      new ConnectionManager(
        new ManagedDeviceRuntime(device),
        client,
      );

    server =
      new ProxyServer(
        connectionManager,
      );

    await expect(
      server.start(),
    ).rejects.toThrow(
      'Target Modbus client is not connected.',
    );
  });

  it('starts successfully', async () => {
    server =
      await createConnectedServer();

    await server.start();

    expect(server.isRunning).toBe(true);
    expect(server.port).toBeGreaterThan(0);
  });

  it('throws when started twice', async () => {
    server =
      await createConnectedServer();

    await server.start();

    await expect(
      server.start(),
    ).rejects.toThrow(
      'Proxy server is already running.',
    );
  });

  it('accepts an incoming TCP client', async () => {
    server =
      await createConnectedServer();

    await server.start();

    const client =
      await connectClient(
        server.port,
      );

    clients.push(client);

    await waitForEventLoop();

    expect(server.sessionCount).toBe(1);
  });

  it('removes a disconnected client session', async () => {
    server =
      await createConnectedServer();

    await server.start();

    const client =
      await connectClient(
        server.port,
      );

    clients.push(client);

    await waitForEventLoop();

    expect(server.sessionCount).toBe(1);

    await new Promise<void>((resolve) => {
        client.once('close', () => resolve());
        client.destroy();
    });

    await waitForEventLoop();

    expect(server.sessionCount).toBe(0);
  });

  it('disconnects all clients when stopped', async () => {
    server =
      await createConnectedServer();

    await server.start();

    const firstClient =
      await connectClient(
        server.port,
      );

    const secondClient =
      await connectClient(
        server.port,
      );

    clients.push(
      firstClient,
      secondClient,
    );

    await waitForEventLoop();

    expect(server.sessionCount).toBe(2);

    await server.stop();

    expect(server.isRunning).toBe(false);
    expect(server.sessionCount).toBe(0);
  });
});