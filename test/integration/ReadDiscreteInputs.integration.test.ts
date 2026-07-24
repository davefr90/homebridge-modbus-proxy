import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe(
  'ReadDiscreteInputs',
  () => {
    let server: FakeModbusServer;
    let client: ModbusClient;

    beforeEach(
      async () => {
        server =
          new FakeModbusServer();

        await server.start();

        client =
          new ModbusClient(
            '127.0.0.1',
            server.port,
          );

        await client.connect();
      },
    );

    afterEach(
      async () => {
        client.disconnect();

        await server.stop();
      },
    );

    it(
      'reads discrete input values',
      async () => {
        server.discreteInputs.writeInput(
          0,
          true,
        );

        server.discreteInputs.writeInput(
          1,
          false,
        );

        server.discreteInputs.writeInput(
          2,
          true,
        );

        server.discreteInputs.writeInput(
          3,
          true,
        );

        server.discreteInputs.writeInput(
          4,
          false,
        );

        const values =
          await client.readDiscreteInputs(
            1,
            0,
            5,
          );

        expect(values).toEqual([
          true,
          false,
          true,
          true,
          false,
        ]);
      },
    );

    it(
      'returns false for unset discrete inputs',
      async () => {
        const values =
          await client.readDiscreteInputs(
            1,
            0,
            8,
          );

        expect(values).toEqual([
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ]);
      },
    );
  },
);