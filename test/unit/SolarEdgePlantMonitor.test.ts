import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  SolarEdgePlantSnapshot,
} from '../../src/sunspec/models/snapshots/SolarEdgePlantSnapshot.js';

import {
  SolarEdgePlantMonitor,
} from '../../src/sunspec/solaredge/SolarEdgePlantMonitor.js';

import type {
  SolarEdgePlantMonitorClient,
} from '../../src/sunspec/solaredge/SolarEdgePlantMonitor.js';

/**
 * Creates an opaque snapshot sufficient for monitor tests.
 */
function createSnapshot(
  inverterAcPower: number,
): SolarEdgePlantSnapshot {

  return {
    inverterAcPower,
  } as SolarEdgePlantSnapshot;

}

/**
 * Creates a mocked connected monitor client.
 */
function createClient(
  snapshot: ReturnType<typeof vi.fn>,
) {

  const disconnect =
    vi.fn()
      .mockResolvedValue(
        undefined,
      );

  const client = {
    isConnected: true,
    snapshot,
    disconnect,
  } as SolarEdgePlantMonitorClient;

  return {
    client,
    disconnect,
  };

}

describe(
  'SolarEdgePlantMonitor',
  () => {

    afterEach(
      () => {
        vi.useRealTimers();
      },
    );

    it(
      'reads and caches an immediate snapshot when started',
      async () => {

        const snapshot =
          createSnapshot(
            500,
          );

        const snapshotReader =
          vi.fn()
            .mockResolvedValue(
              snapshot,
            );

        const {
          client,
          disconnect,
        } = createClient(
          snapshotReader,
        );

        const listener =
          vi.fn();

        const monitor =
          new SolarEdgePlantMonitor(
            vi.fn()
              .mockResolvedValue(
                client,
              ),
            1000,
          );

        monitor.onSnapshot(
          listener,
        );

        await monitor.start();

        expect(
          monitor.latest(),
        ).toBe(
          snapshot,
        );

        expect(
          listener,
        ).toHaveBeenCalledWith(
          snapshot,
          expect.any(
            Date,
          ),
        );

        expect(
          monitor.status(),
        ).toMatchObject({
          running: true,
          connected: true,
          polling: false,
          lastError: undefined,
          consecutiveFailures: 0,
        });

        await monitor.stop();

        expect(
          disconnect,
        ).toHaveBeenCalledTimes(
          1,
        );

      },
    );

    it(
      'does not overlap slow periodic refreshes',
      async () => {

        vi.useFakeTimers();

        const firstSnapshot =
          createSnapshot(
            100,
          );

        const secondSnapshot =
          createSnapshot(
            200,
          );

        let resolveSlowSnapshot:
          (
            snapshot: SolarEdgePlantSnapshot,
          ) => void = () => {
          };

        const slowSnapshot =
          new Promise<SolarEdgePlantSnapshot>(
            (resolve) => {
              resolveSlowSnapshot =
                resolve;
            },
          );

        const snapshotReader =
          vi.fn()
            .mockResolvedValueOnce(
              firstSnapshot,
            )
            .mockReturnValueOnce(
              slowSnapshot,
            )
            .mockResolvedValue(
              secondSnapshot,
            );

        const {
          client,
        } = createClient(
          snapshotReader,
        );

        const monitor =
          new SolarEdgePlantMonitor(
            vi.fn()
              .mockResolvedValue(
                client,
              ),
            100,
          );

        await monitor.start();

        await vi.advanceTimersByTimeAsync(
          500,
        );

        expect(
          snapshotReader,
        ).toHaveBeenCalledTimes(
          2,
        );

        resolveSlowSnapshot(
          secondSnapshot,
        );

        await Promise.resolve();

        await vi.advanceTimersByTimeAsync(
          100,
        );

        expect(
          snapshotReader,
        ).toHaveBeenCalledTimes(
          3,
        );

        await monitor.stop();

      },
    );

    it(
      'retains the last snapshot and reconnects after an error',
      async () => {

        vi.useFakeTimers();

        const firstSnapshot =
          createSnapshot(
            300,
          );

        const recoveredSnapshot =
          createSnapshot(
            400,
          );

        const firstReader =
          vi.fn()
            .mockResolvedValueOnce(
              firstSnapshot,
            )
            .mockRejectedValueOnce(
              new Error(
                'Connection closed.',
              ),
            );

        const firstClient =
          createClient(
            firstReader,
          );

        const secondReader =
          vi.fn()
            .mockResolvedValue(
              recoveredSnapshot,
            );

        const secondClient =
          createClient(
            secondReader,
          );

        const clientFactory =
          vi.fn()
            .mockResolvedValueOnce(
              firstClient.client,
            )
            .mockResolvedValueOnce(
              secondClient.client,
            );

        const errorListener =
          vi.fn();

        const monitor =
          new SolarEdgePlantMonitor(
            clientFactory,
            100,
          );

        monitor.onError(
          errorListener,
        );

        await monitor.start();

        await vi.advanceTimersByTimeAsync(
          100,
        );

        expect(
          monitor.latest(),
        ).toBe(
          firstSnapshot,
        );

        expect(
          monitor.status(),
        ).toMatchObject({
          connected: false,
          consecutiveFailures: 1,
        });

        expect(
          errorListener,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'Connection closed.',
          }),
          expect.any(
            Date,
          ),
        );

        expect(
          firstClient.disconnect,
        ).toHaveBeenCalledTimes(
          1,
        );

        await vi.advanceTimersByTimeAsync(
          100,
        );

        expect(
          clientFactory,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          monitor.latest(),
        ).toBe(
          recoveredSnapshot,
        );

        expect(
          monitor.status(),
        ).toMatchObject({
          connected: true,
          lastError: undefined,
          consecutiveFailures: 0,
        });

        await monitor.stop();

      },
    );

    it(
      'validates intervals and unregisters listeners',
      async () => {

        expect(
          () =>
            new SolarEdgePlantMonitor(
              vi.fn(),
              0,
            ),
        ).toThrow(
          'Plant polling interval must be greater than zero.',
        );

        const snapshot =
          createSnapshot(
            600,
          );

        const {
          client,
        } = createClient(
          vi.fn()
            .mockResolvedValue(
              snapshot,
            ),
        );

        const monitor =
          new SolarEdgePlantMonitor(
            vi.fn()
              .mockResolvedValue(
                client,
              ),
          );

        const snapshotListener =
          vi.fn();

        const errorListener =
          vi.fn();

        monitor.onSnapshot(
          snapshotListener,
        );

        monitor.offSnapshot(
          snapshotListener,
        );

        monitor.onError(
          errorListener,
        );

        monitor.offError(
          errorListener,
        );

        await monitor.refresh();

        expect(
          snapshotListener,
        ).not.toHaveBeenCalled();

        expect(
          errorListener,
        ).not.toHaveBeenCalled();

        await monitor.stop();

      },
    );

  },
);
