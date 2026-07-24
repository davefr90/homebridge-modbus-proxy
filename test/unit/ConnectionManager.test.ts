import { describe, expect, it } from 'vitest';

import { ConnectionManager } from '../../src/proxy/ConnectionManager.js';
import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';

describe('ConnectionManager', () => {
  const device: ManagedDevice = {
    id: 'device-1',
    name: 'Test Device',
    host: '127.0.0.1',
    port: 502,
    unitId: 1,
  };

  function createManager(): ConnectionManager {
    return new ConnectionManager(
      new ManagedDeviceRuntime(device),
    );
  }

  it('returns its runtime', () => {
    const manager = createManager();

    expect(manager.getRuntime()).toBeInstanceOf(
      ManagedDeviceRuntime,
    );
  });

  it('starts disconnected', () => {
    const manager = createManager();

    expect(manager.isConnected()).toBe(false);
  });

  it('connect marks runtime as connected', () => {
    const manager = createManager();

    manager.connect();

    expect(manager.isConnected()).toBe(true);
    expect(manager.getRuntime().lastSeen).toBeInstanceOf(
      Date,
    );
    expect(manager.getRuntime().lastError).toBeUndefined();
  });

  it('disconnect marks runtime as disconnected', () => {
    const manager = createManager();

    manager.connect();
    manager.disconnect();

    expect(manager.isConnected()).toBe(false);
  });

  it('disconnect stores the last error', () => {
    const manager = createManager();

    const error = new Error('Connection lost');

    manager.disconnect(error);

    expect(manager.getRuntime().lastError).toBe(error);
  });
});