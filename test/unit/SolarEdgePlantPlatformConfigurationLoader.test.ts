import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  SolarEdgePlantPlatformConfigurationLoader,
} from '../../src/config/SolarEdgePlantPlatformConfigurationLoader.js';

describe(
  'SolarEdgePlantPlatformConfigurationLoader',
  () => {

    const loader =
      new SolarEdgePlantPlatformConfigurationLoader();

    it(
      'keeps monitoring disabled when no section exists',
      () => {

        expect(
          loader.load(
            undefined,
          ),
        ).toBeUndefined();

      },
    );

    it(
      'applies safe defaults to a configured plant',
      () => {

        const configuration =
          loader.load({
            host:
              ' 192.168.2.101 ',
          });

        expect(
          configuration,
        ).toEqual({
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
        });

        expect(
          Object.isFrozen(
            configuration,
          ),
        ).toBe(
          true,
        );

        expect(
          Object.isFrozen(
            configuration
              ?.unitIds,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'accepts explicit plant settings',
      () => {

        expect(
          loader.load({
            host: 'solaredge.local',
            port: 1502,
            unitIds: [
              4,
              5,
            ],
            meterUnitId: 5,
            pollIntervalMs: 10000,
            meterConsistencyThresholdWatts:
              250.5,
            snapshotRetryCount: 2,
          }),
        ).toEqual({
          host: 'solaredge.local',
          port: 1502,
          unitIds: [
            4,
            5,
          ],
          meterUnitId: 5,
          pollIntervalMs: 10000,
          meterConsistencyThresholdWatts:
            250.5,
          snapshotRetryCount: 2,
        });

      },
    );

    it(
      'rejects malformed sections and hosts',
      () => {

        expect(
          () =>
            loader.load(
              'invalid',
            ),
        ).toThrow(
          'SolarEdge plant configuration must be an object.',
        );

        expect(
          () =>
            loader.load({}),
        ).toThrow(
          'SolarEdge plant host must be a string.',
        );

        expect(
          () =>
            loader.load({
              host: ' ',
            }),
        ).toThrow(
          'SolarEdge plant host must not be empty.',
        );

      },
    );

    it(
      'rejects invalid inverter and meter unit topology',
      () => {

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              unitIds: [],
            }),
        ).toThrow(
          'At least one SolarEdge inverter unit ID is required.',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              unitIds: [
                2,
                2,
              ],
            }),
        ).toThrow(
          'Duplicate SolarEdge inverter unit ID: 2',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              unitIds: [
                248,
              ],
            }),
        ).toThrow(
          'Invalid SolarEdge inverter unit ID: 248',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              unitIds: [
                2,
                3,
              ],
              meterUnitId: 1,
            }),
        ).toThrow(
          'SolarEdge meter unit ID is not part of the inverter units: 1',
        );

      },
    );

    it(
      'rejects invalid numeric runtime settings',
      () => {

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              port: 0,
            }),
        ).toThrow(
          'SolarEdge Modbus TCP port must be an integer between 1 and 65535.',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              pollIntervalMs: 999,
            }),
        ).toThrow(
          'SolarEdge polling interval must be an integer between 1000',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              meterConsistencyThresholdWatts:
                -1,
            }),
        ).toThrow(
          'SolarEdge meter consistency threshold must be a finite number greater than or equal to 0.',
        );

        expect(
          () =>
            loader.load({
              host: '127.0.0.1',
              snapshotRetryCount: 11,
            }),
        ).toThrow(
          'SolarEdge snapshot retry count must be an integer between 0 and 10.',
        );

      },
    );

  },
);
