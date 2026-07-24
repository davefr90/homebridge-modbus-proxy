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
  'ReadCoils',
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
      'reads coil values',
      async () => {
        server.coils.writeCoil(
          0,
          true,
        );

        server.coils.writeCoil(
          1,
          false,
        );

        server.coils.writeCoil(
          2,
          true,
        );

        server.coils.writeCoil(
          3,
          true,
        );

        server.coils.writeCoil(
          4,
          false,
        );

        const values =
          await client.readCoils(
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
      'returns false for unset coils',
      async () => {
        const values =
          await client.readCoils(
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