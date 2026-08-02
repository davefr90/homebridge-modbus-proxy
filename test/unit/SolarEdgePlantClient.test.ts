import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  SunSpecDevice,
} from '../../src/sunspec/devices/SunSpecDevice.js';

import type {
  InverterSnapshot,
} from '../../src/sunspec/models/snapshots/InverterSnapshot.js';

import type {
  MeterSnapshot,
} from '../../src/sunspec/models/snapshots/MeterSnapshot.js';

import {
  SolarEdgePlantClient,
} from '../../src/sunspec/solaredge/SolarEdgePlantClient.js';

/**
 * Creates the subset of an inverter snapshot required by the
 * plant calculator.
 */
function createInverterSnapshot(
  acPower: number,
): InverterSnapshot {

  return {
    acPower,
    dcPower: acPower,
  } as InverterSnapshot;

}

/**
 * Creates the subset of a meter snapshot required by the
 * plant calculator.
 */
function createMeterSnapshot(
  activePower: number,
): MeterSnapshot {

  return {
    activePower,

    importPower:
      Math.max(
        0,
        -activePower,
      ),

    exportPower:
      Math.max(
        0,
        activePower,
      ),
  } as MeterSnapshot;

}

/**
 * Instantiates a discovered plant client with controlled unit
 * devices so snapshot timing can be tested without TCP.
 */
function createPlantClient(
  meterPowers: readonly number[],
  thresholdWatts: number,
  retryCount: number,
  readOrder: string[],
): {
  readonly client: SolarEdgePlantClient;
  readonly meterSnapshot: ReturnType<typeof vi.fn>;
  readonly inverterSnapshots:
    readonly ReturnType<typeof vi.fn>[];
} {

  const meterValues =
    [...meterPowers];

  const meterSnapshot =
    vi.fn(
      async () => {

        const activePower =
          meterValues.shift();

        if (activePower === undefined) {
          throw new Error(
            'No fake meter snapshot remains.',
          );
        }

        readOrder.push(
          `meter:${activePower}`,
        );

        return createMeterSnapshot(
          activePower,
        );

      },
    );

  const inverterSnapshots =
    [
      2,
      3,
    ].map(
      (unitId) =>
        vi.fn(
          async () => {

            readOrder.push(
              `inverter:${unitId}`,
            );

            return createInverterSnapshot(
              1000,
            );

          },
        ),
    );

  const devices =
    new Map<number, SunSpecDevice>([
      [
        2,
        {
          inverter: {
            snapshot:
              inverterSnapshots[0],
          },
          meter: {
            snapshot:
              meterSnapshot,
          },
        } as unknown as SunSpecDevice,
      ],
      [
        3,
        {
          inverter: {
            snapshot:
              inverterSnapshots[1],
          },
        } as unknown as SunSpecDevice,
      ],
    ]);

  const ClientConstructor =
    SolarEdgePlantClient as unknown as {
      new (
        modbusClient: unknown,
        clientOptions: unknown,
        plantDevices: ReadonlyMap<number, SunSpecDevice>,
      ): SolarEdgePlantClient;
    };

  const client =
    new ClientConstructor(
      {
        isConnected: true,
        disconnect: vi.fn(),
      },
      {
        host: '127.0.0.1',
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
        meterConsistencyThresholdWatts:
          thresholdWatts,
        snapshotRetryCount:
          retryCount,
      },
      devices,
    );

  return {
    client,
    meterSnapshot,
    inverterSnapshots,
  };

}

describe(
  'SolarEdgePlantClient',
  () => {

    it(
      'rejects invalid connection and topology options before connecting',
      async () => {

        await expect(
          SolarEdgePlantClient.connect({
            host: ' ',
          }),
        ).rejects.toThrow(
          'SolarEdge plant host must not be empty.',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            unitIds: [],
          }),
        ).rejects.toThrow(
          'At least one SolarEdge plant unit ID is required.',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            unitIds: [
              2,
              2,
            ],
          }),
        ).rejects.toThrow(
          'Duplicate SolarEdge plant unit ID: 2',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            unitIds: [
              2,
              3,
            ],
            meterUnitId: 1,
          }),
        ).rejects.toThrow(
          'Meter unit ID is not part of the SolarEdge plant: 1',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            unitIds: [
              248,
            ],
          }),
        ).rejects.toThrow(
          'Invalid Modbus unit ID: 248',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            meterConsistencyThresholdWatts:
              -1,
          }),
        ).rejects.toThrow(
          'Meter consistency threshold must be a finite non-negative number.',
        );

        await expect(
          SolarEdgePlantClient.connect({
            host: '127.0.0.1',
            snapshotRetryCount:
              1.5,
          }),
        ).rejects.toThrow(
          'Snapshot retry count must be a non-negative integer.',
        );

      },
    );

    it(
      'frames sequential unit reads with two consistent meter snapshots',
      async () => {

        const readOrder:
          string[] = [];

        const {
          client,
          meterSnapshot,
          inverterSnapshots,
        } = createPlantClient(
          [
            100,
            120,
          ],
          500,
          1,
          readOrder,
        );

        const snapshot =
          await client.snapshot();

        expect(
          snapshot.gridPower,
        ).toBe(
          120,
        );

        expect(
          snapshot.consumptionPower,
        ).toBe(
          1880,
        );

        expect(
          meterSnapshot,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          inverterSnapshots[0],
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          inverterSnapshots[1],
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          readOrder,
        ).toEqual([
          'meter:100',
          'inverter:2',
          'inverter:3',
          'meter:120',
        ]);

      },
    );

    it(
      'retries immediately after a large meter change',
      async () => {

        const readOrder:
          string[] = [];

        const {
          client,
          meterSnapshot,
          inverterSnapshots,
        } = createPlantClient(
          [
            0,
            2000,
            2000,
            2050,
          ],
          100,
          1,
          readOrder,
        );

        const snapshot =
          await client.snapshot();

        expect(
          snapshot.gridPower,
        ).toBe(
          2050,
        );

        expect(
          meterSnapshot,
        ).toHaveBeenCalledTimes(
          4,
        );

        for (const inverterSnapshot of inverterSnapshots) {
          expect(
            inverterSnapshot,
          ).toHaveBeenCalledTimes(
            2,
          );
        }

        expect(
          readOrder,
        ).toEqual([
          'meter:0',
          'inverter:2',
          'inverter:3',
          'meter:2000',
          'meter:2000',
          'inverter:2',
          'inverter:3',
          'meter:2050',
        ]);

      },
    );

    it(
      'rejects a snapshot that remains inconsistent after all attempts',
      async () => {

        const readOrder:
          string[] = [];

        const {
          client,
        } = createPlantClient(
          [
            0,
            1000,
            2000,
            3000,
          ],
          100,
          1,
          readOrder,
        );

        await expect(
          client.snapshot(),
        ).rejects.toThrow(
          'SolarEdge plant changed by 1000 W while the snapshot was read; '
          + 'the permitted meter change is 100 W after 2 attempts.',
        );

        expect(
          readOrder,
        ).toHaveLength(
          8,
        );

      },
    );

  },
);
