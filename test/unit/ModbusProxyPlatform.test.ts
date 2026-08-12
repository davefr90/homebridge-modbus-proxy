import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  API,
  Logging,
  PlatformAccessory,
} from 'homebridge';

import type {
  Logger,
} from '../../src/logging/Logger.js';

import type {
  ModbusTcpProxyRuntimeStatus,
} from '../../src/runtime/ModbusTcpProxyRuntime.js';

import {
  ModbusProxyPlatform,
} from '../../src/platform.js';

import type {
  SolarEdgePlantSnapshot,
} from '../../src/sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import type {
  SolarEdgePlantMonitorStatus,
} from '../../src/sunspec/solaredge/SolarEdgePlantMonitorStatus.js';

/**
 * Creates a Homebridge logger test double.
 */
function createLogging() {

  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as Logging;

}

/**
 * Creates an API test double and records lifecycle listeners.
 */
function createApi() {

  const listeners =
    new Map<string, () => void>();

  const apiObject = {
    on: vi.fn(),
    unregisterPlatformAccessories:
      vi.fn(),
  };

  const api =
    apiObject as unknown as API;

  apiObject.on.mockImplementation(
    (
      event: string,
      listener: () => void,
    ) => {
      listeners.set(
        event,
        listener,
      );

      return api;
    },
  );

  return {
    api,
    listeners,
    unregisterPlatformAccessories:
      apiObject.unregisterPlatformAccessories,
  };

}

function createStatus():
  SolarEdgePlantMonitorStatus {

  return {
    running: true,
    connected: true,
    polling: false,
    lastAttemptAt: undefined,
    lastUpdatedAt: undefined,
    lastError: undefined,
    consecutiveFailures: 0,
  };

}

function createProxyStatus():
  ModbusTcpProxyRuntimeStatus {

  return {
    running: true,
    targetConnected: true,
    listeningPort: 1502,
    clientCount: 2,
  };

}

describe(
  'ModbusProxyPlatform',
  () => {

    it(
      'creates and owns a configured SolarEdge plant runtime',
      async () => {

        const snapshot = {
          inverterAcPower: 1500,
        } as SolarEdgePlantSnapshot;

        const status =
          createStatus();

        const runtime = {
          start: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
          stop: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
          latest: vi.fn()
            .mockReturnValue(
              snapshot,
            ),
          status: vi.fn()
            .mockReturnValue(
              status,
            ),
        };

        const runtimeFactory =
          vi.fn()
            .mockReturnValue(
              runtime,
            );

        const log =
          createLogging();

        const {
          api,
          listeners,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
              solarEdge: {
                host: '192.168.2.101',
              },
            },
            api,
            runtimeFactory,
          );

        expect(
          runtimeFactory,
        ).toHaveBeenCalledWith(
          {
            host: '192.168.2.101',
            port: 502,
            unitIds: [
              2,
              3,
            ],
            meterUnitId: 2,
            pollIntervalMs: 5000,
            meterConsistencyThresholdWatts: 500,
            snapshotRetryCount: 1,
          },
          expect.any(
            Object,
          ),
        );

        expect(
          listeners.has(
            'didFinishLaunching',
          ),
        ).toBe(
          true,
        );

        expect(
          listeners.has(
            'shutdown',
          ),
        ).toBe(
          true,
        );

        await platform.start();

        expect(
          runtime.start,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          platform.latestPlantSnapshot(),
        ).toBe(
          snapshot,
        );

        expect(
          platform.plantMonitorStatus(),
        ).toBe(
          status,
        );

        const runtimeLogger =
          runtimeFactory.mock
            .calls[0]
            ?.[1] as Logger;

        runtimeLogger.error(
          'Runtime error.',
          new Error(
            'Details.',
          ),
        );

        expect(
          log.error,
        ).toHaveBeenCalledWith(
          'Runtime error. Details.',
        );

        await platform.shutdown();

        expect(
          runtime.stop,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'keeps SolarEdge monitoring optional',
      async () => {

        const runtimeFactory =
          vi.fn();

        const log =
          createLogging();

        const {
          api,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
            },
            api,
            runtimeFactory,
          );

        await platform.start();

        expect(
          runtimeFactory,
        ).not.toHaveBeenCalled();

        expect(
          log.info,
        ).toHaveBeenCalledWith(
          'SolarEdge plant monitoring is not configured.',
        );

        expect(
          platform.latestPlantSnapshot(),
        ).toBeUndefined();

        expect(
          platform.plantMonitorStatus(),
        ).toBeUndefined();

      },
    );

    it(
      'creates and owns a configured Modbus TCP proxy runtime',
      async () => {

        const status =
          createProxyStatus();

        const proxyRuntime = {
          start: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
          stop: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
          status: vi.fn()
            .mockReturnValue(
              status,
            ),
        };

        const plantRuntimeFactory =
          vi.fn();

        const proxyRuntimeFactory =
          vi.fn()
            .mockReturnValue(
              proxyRuntime,
            );

        const log =
          createLogging();

        const {
          api,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
              modbusProxy: {
                targetHost: '192.168.2.101',
              },
            },
            api,
            plantRuntimeFactory,
            proxyRuntimeFactory,
          );

        expect(
          proxyRuntimeFactory,
        ).toHaveBeenCalledWith(
          {
            targetHost: '192.168.2.101',
            targetPort: 502,
            listenHost: '0.0.0.0',
            listenPort: 1502,
          },
          expect.any(
            Object,
          ),
        );

        await platform.start();

        expect(
          proxyRuntime.start,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          platform.modbusProxyStatus(),
        ).toBe(
          status,
        );

        await platform.shutdown();

        expect(
          proxyRuntime.stop,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'reports invalid Modbus TCP proxy configuration without crashing the platform',
      async () => {

        const plantRuntimeFactory =
          vi.fn();

        const proxyRuntimeFactory =
          vi.fn();

        const log =
          createLogging();

        const {
          api,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
              modbusProxy: {
                targetHost: '',
              },
            },
            api,
            plantRuntimeFactory,
            proxyRuntimeFactory,
          );

        expect(
          proxyRuntimeFactory,
        ).not.toHaveBeenCalled();

        expect(
          log.error,
        ).toHaveBeenCalledWith(
          'Invalid Modbus TCP proxy configuration: Modbus TCP proxy target host must not be empty.',
        );

        await platform.start();

        expect(
          log.info,
        ).not.toHaveBeenCalledWith(
          'Modbus TCP proxy server is not configured.',
        );

        expect(
          platform.modbusProxyStatus(),
        ).toBeUndefined();

      },
    );

    it(
      'reports invalid SolarEdge configuration without crashing the platform',
      async () => {

        const runtimeFactory =
          vi.fn();

        const log =
          createLogging();

        const {
          api,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
              solarEdge: {
                host: '',
              },
            },
            api,
            runtimeFactory,
          );

        expect(
          runtimeFactory,
        ).not.toHaveBeenCalled();

        expect(
          log.error,
        ).toHaveBeenCalledWith(
          'Invalid SolarEdge plant configuration: SolarEdge plant host must not be empty.',
        );

        await platform.start();

        expect(
          log.info,
        ).not.toHaveBeenCalledWith(
          'SolarEdge plant monitoring is not configured.',
        );

      },
    );

    it(
      'removes obsolete cached accessories with real plugin identifiers',
      () => {

        const log =
          createLogging();

        const {
          api,
          unregisterPlatformAccessories,
        } = createApi();

        const platform =
          new ModbusProxyPlatform(
            log,
            {
              platform: 'ModbusProxy',
              name: 'Modbus Proxy',
            },
            api,
          );

        const accessory = {
          displayName: 'Old Accessory',
        } as PlatformAccessory;

        platform.configureAccessory(
          accessory,
        );

        expect(
          unregisterPlatformAccessories,
        ).toHaveBeenCalledWith(
          'homebridge-modbus-proxy',
          'ModbusProxy',
          [
            accessory,
          ],
        );

      },
    );

  },
);
