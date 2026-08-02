import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  NormalizedSolarEdgePlantPlatformConfiguration,
} from '../../src/config/SolarEdgePlantPlatformConfiguration.js';

import type {
  Logger,
} from '../../src/logging/Logger.js';

import {
  SolarEdgePlantRuntime,
} from '../../src/runtime/SolarEdgePlantRuntime.js';

import type {
  SolarEdgePlantSnapshot,
} from '../../src/sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import type {
  SolarEdgePlantMonitorStatus,
} from '../../src/sunspec/solaredge/SolarEdgePlantMonitorStatus.js';

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

/**
 * Returns a complete monitor status for runtime tests.
 */
function createStatus(
  connected = true,
): SolarEdgePlantMonitorStatus {

  return {
    running: true,
    connected,
    polling: false,
    lastAttemptAt: new Date(
      '2026-08-02T20:00:00.000Z',
    ),
    lastUpdatedAt: new Date(
      '2026-08-02T20:00:01.000Z',
    ),
    lastError: undefined,
    consecutiveFailures: 0,
  };

}

describe(
  'SolarEdgePlantRuntime',
  () => {

    const configuration:
      NormalizedSolarEdgePlantPlatformConfiguration = {
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
      };

    it(
      'maps configuration and owns monitor start and stop',
      async () => {

        const snapshot = {
          inverterAcPower: 1000,
        } as SolarEdgePlantSnapshot;

        const status =
          createStatus();

        const monitor = {
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
          onSnapshot: vi.fn(),
          onError: vi.fn(),
        };

        const monitorFactory =
          vi.fn()
            .mockReturnValue(
              monitor,
            );

        const logger =
          createLogger();

        const runtime =
          new SolarEdgePlantRuntime(
            configuration,
            logger,
            monitorFactory,
          );

        expect(
          monitorFactory,
        ).toHaveBeenCalledWith(
          {
            host: '192.168.2.101',
            port: 502,
            unitIds: [
              2,
              3,
            ],
            meterUnitId: 2,
            baseAddresses: [
              40000,
              0,
            ],
            meterConsistencyThresholdWatts: 500,
            snapshotRetryCount: 1,
          },
          5000,
        );

        await runtime.start();
        await runtime.start();

        expect(
          monitor.start,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          runtime.latest(),
        ).toBe(
          snapshot,
        );

        expect(
          runtime.status(),
        ).toBe(
          status,
        );

        expect(
          logger.info,
        ).toHaveBeenCalledWith(
          'SolarEdge plant monitor connected and running.',
        );

        await runtime.stop();
        await runtime.stop();

        expect(
          monitor.stop,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'forwards snapshots and refresh failures to the logger',
      () => {

        const monitor = {
          start: vi.fn(),
          stop: vi.fn(),
          latest: vi.fn(),
          status: vi.fn()
            .mockReturnValue(
              createStatus(),
            ),
          onSnapshot: vi.fn(),
          onError: vi.fn(),
        };

        const logger =
          createLogger();

        new SolarEdgePlantRuntime(
          configuration,
          logger,
          () => monitor,
        );

        const snapshotListener =
          monitor.onSnapshot
            .mock.calls[0]
            ?.[0];

        const errorListener =
          monitor.onError
            .mock.calls[0]
            ?.[0];

        expect(
          snapshotListener,
        ).toBeTypeOf(
          'function',
        );

        expect(
          errorListener,
        ).toBeTypeOf(
          'function',
        );

        snapshotListener?.(
          {
            consumptionPower: 1234.567,
            gridPower: -12.345,
            batteryPower: -900.126,
          } as SolarEdgePlantSnapshot,
          new Date(
            '2026-08-02T20:01:00.000Z',
          ),
        );

        expect(
          logger.debug,
        ).toHaveBeenCalledWith(
          'SolarEdge plant snapshot at 2026-08-02T20:01:00.000Z: '
          + 'load 1234.57 W, grid -12.35 W, battery -900.13 W.',
        );

        errorListener?.(
          new Error(
            'Connection closed.',
          ),
          new Date(
            '2026-08-02T20:02:00.000Z',
          ),
        );

        expect(
          logger.warn,
        ).toHaveBeenCalledWith(
          'SolarEdge plant refresh failed at 2026-08-02T20:02:00.000Z: Connection closed.',
        );

      },
    );

    it(
      'reports disconnected startup and permits a retry after a start error',
      async () => {

        const monitor = {
          start: vi.fn()
            .mockRejectedValueOnce(
              new Error(
                'Unable to schedule.',
              ),
            )
            .mockResolvedValueOnce(
              undefined,
            ),
          stop: vi.fn()
            .mockResolvedValue(
              undefined,
            ),
          latest: vi.fn(),
          status: vi.fn()
            .mockReturnValue(
              createStatus(
                false,
              ),
            ),
          onSnapshot: vi.fn(),
          onError: vi.fn(),
        };

        const logger =
          createLogger();

        const runtime =
          new SolarEdgePlantRuntime(
            configuration,
            logger,
            () => monitor,
          );

        await expect(
          runtime.start(),
        ).rejects.toThrow(
          'Unable to schedule.',
        );

        expect(
          logger.error,
        ).toHaveBeenCalledWith(
          'Unable to start SolarEdge plant monitoring.',
          expect.objectContaining({
            message:
              'Unable to schedule.',
          }),
        );

        await runtime.start();

        expect(
          monitor.start,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          logger.warn,
        ).toHaveBeenCalledWith(
          'SolarEdge plant monitor started without a connection; reconnect attempts will continue.',
        );

        await runtime.stop();

      },
    );

  },
);
