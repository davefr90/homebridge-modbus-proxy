import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  SolarEdgePlantClient,
} from '../../src/sunspec/solaredge/SolarEdgePlantClient.js';

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

      },
    );

  },
);
