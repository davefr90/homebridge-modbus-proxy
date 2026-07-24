import { describe, expect, it } from 'vitest';

import { DeviceManager } from '../../src/proxy/DeviceManager.js';
import { ManagedDevice } from '../../src/proxy/ManagedDevice.js';

describe('DeviceManager', () => {
  const createDevice = (
    overrides: Partial<ManagedDevice> = {},
  ): ManagedDevice => ({
    id: 'device-1',
    name: 'Test Device',
    host: '192.168.1.100',
    port: 502,
    unitId: 1,
    ...overrides,
  });

  it('starts empty', () => {
    const manager = new DeviceManager();

    expect(manager.size).toBe(0);
    expect(manager.getDevices()).toEqual([]);
  });

  it('adds a device', () => {
    const manager = new DeviceManager();
    const device = createDevice();

    manager.addDevice(device);

    expect(manager.size).toBe(1);
  });

  it('returns a device by id', () => {
    const manager = new DeviceManager();
    const device = createDevice();

    manager.addDevice(device);

    expect(manager.getDevice(device.id)).toBe(device);
  });

  it('returns undefined for an unknown device id', () => {
    const manager = new DeviceManager();

    expect(manager.getDevice('unknown-device')).toBeUndefined();
  });

  it('returns all devices', () => {
    const manager = new DeviceManager();

    const firstDevice = createDevice({
      id: 'device-1',
      name: 'First Device',
    });

    const secondDevice = createDevice({
      id: 'device-2',
      name: 'Second Device',
      host: '192.168.1.101',
      unitId: 2,
    });

    manager.addDevice(firstDevice);
    manager.addDevice(secondDevice);

    expect(manager.getDevices()).toEqual([
      firstDevice,
      secondDevice,
    ]);
  });

  it('removes an existing device', () => {
    const manager = new DeviceManager();
    const device = createDevice();

    manager.addDevice(device);

    const removed = manager.removeDevice(device.id);

    expect(removed).toBe(true);
    expect(manager.size).toBe(0);
    expect(manager.getDevice(device.id)).toBeUndefined();
  });

  it('returns false when removing an unknown device', () => {
    const manager = new DeviceManager();

    const removed = manager.removeDevice('unknown-device');

    expect(removed).toBe(false);
  });

  it('clears all devices', () => {
    const manager = new DeviceManager();

    manager.addDevice(
      createDevice({
        id: 'device-1',
      }),
    );

    manager.addDevice(
      createDevice({
        id: 'device-2',
      }),
    );

    manager.clear();

    expect(manager.size).toBe(0);
    expect(manager.getDevices()).toEqual([]);
  });

  it('throws when adding a duplicate device id', () => {
    const manager = new DeviceManager();

    manager.addDevice(
      createDevice({
        id: 'device-1',
        name: 'First Device',
      }),
    );

    expect(() => {
      manager.addDevice(
        createDevice({
          id: 'device-1',
          name: 'Duplicate Device',
        }),
      );
    }).toThrow("Device 'device-1' already exists.");
  });

  it('updates the size when devices are added and removed', () => {
    const manager = new DeviceManager();

    const firstDevice = createDevice({
      id: 'device-1',
    });

    const secondDevice = createDevice({
      id: 'device-2',
    });

    expect(manager.size).toBe(0);

    manager.addDevice(firstDevice);
    expect(manager.size).toBe(1);

    manager.addDevice(secondDevice);
    expect(manager.size).toBe(2);

    manager.removeDevice(firstDevice.id);
    expect(manager.size).toBe(1);

    manager.clear();
    expect(manager.size).toBe(0);
  });
});