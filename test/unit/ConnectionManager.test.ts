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

describe('ConnectionManager', () => {
  const device: ManagedDevice = {
    id: 'device-1',
    name: 'Test Device',
    host: '127.0.0.1',
    port: 502,
    unitId: 1,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createManager(): {
    manager: ConnectionManager;
    client: ModbusClient;
  } {
    const client =
      new ModbusClient(
        device.host,
        device.port,
      );

    const manager =
      new ConnectionManager(
        new ManagedDeviceRuntime(device),
        client,
      );

    return {
      manager,
      client,
    };
  }

  it('returns its runtime', () => {
    const { manager } =
      createManager();

    expect(
      manager.getRuntime(),
    ).toBeInstanceOf(
      ManagedDeviceRuntime,
    );
  });

  it('returns its Modbus client', () => {
    const {
      manager,
      client,
    } = createManager();

    expect(
      manager.getClient(),
    ).toBe(client);
  });

  it('starts disconnected', () => {
    const { manager } =
      createManager();

    expect(
      manager.isConnected(),
    ).toBe(false);
  });

  it('connects the Modbus client and updates the runtime', async () => {
    const {
      manager,
      client,
    } = createManager();

    const connectSpy =
      vi.spyOn(
        client,
        'connect',
      ).mockResolvedValue();

    await manager.connect();

    expect(connectSpy).toHaveBeenCalledOnce();

    expect(
      manager.isConnected(),
    ).toBe(true);

    expect(
      manager.getRuntime().lastSeen,
    ).toBeInstanceOf(Date);

    expect(
      manager.getRuntime().lastError,
    ).toBeUndefined();
  });

  it('stores a connection error and keeps the runtime disconnected', async () => {
    const {
      manager,
      client,
    } = createManager();

    const error =
      new Error(
        'Connection failed',
      );

    vi.spyOn(
      client,
      'connect',
    ).mockRejectedValue(error);

    await expect(
      manager.connect(),
    ).rejects.toBe(error);

    expect(
      manager.isConnected(),
    ).toBe(false);

    expect(
      manager.getRuntime().lastError,
    ).toBe(error);
  });

  it('disconnects the Modbus client and updates the runtime', async () => {
    const {
      manager,
      client,
    } = createManager();

    vi.spyOn(
      client,
      'connect',
    ).mockResolvedValue();

    const disconnectSpy =
      vi.spyOn(
        client,
        'disconnect',
      ).mockImplementation(() => {});

    await manager.connect();
    manager.disconnect();

    expect(
      disconnectSpy,
    ).toHaveBeenCalledOnce();

    expect(
      manager.isConnected(),
    ).toBe(false);
  });

  it('stores the last disconnection error', () => {
    const {
      manager,
      client,
    } = createManager();

    vi.spyOn(
      client,
      'disconnect',
    ).mockImplementation(() => {});

    const error =
      new Error(
        'Connection lost',
      );

    manager.disconnect(error);

    expect(
      manager.getRuntime().lastError,
    ).toBe(error);
  });
});