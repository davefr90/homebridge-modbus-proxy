import { describe, expect, it } from 'vitest';

import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';

describe('ManagedDeviceRuntime', () => {
  const device: ManagedDevice = {
    id: 'device-1',
    name: 'Test Device',
    host: '127.0.0.1',
    port: 502,
    unitId: 1,
  };

  it('stores the managed device', () => {
    const runtime = new ManagedDeviceRuntime(device);

    expect(runtime.device).toBe(device);
  });

  it('starts disconnected', () => {
    const runtime = new ManagedDeviceRuntime(device);

    expect(runtime.connected).toBe(false);
  });

  it('starts without lastSeen', () => {
    const runtime = new ManagedDeviceRuntime(device);

    expect(runtime.lastSeen).toBeUndefined();
  });

  it('starts without lastError', () => {
    const runtime = new ManagedDeviceRuntime(device);

    expect(runtime.lastError).toBeUndefined();
  });

  it('allows runtime state to change', () => {
    const runtime = new ManagedDeviceRuntime(device);

    const now = new Date();
    const error = new Error('Test');

    runtime.connected = true;
    runtime.lastSeen = now;
    runtime.lastError = error;

    expect(runtime.connected).toBe(true);
    expect(runtime.lastSeen).toBe(now);
    expect(runtime.lastError).toBe(error);
  });
});