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
  'Read Holding Registers integration',
  () => {
    let server: FakeModbusServer;
    let client: ModbusClient;

    beforeEach(async () => {
      server = new FakeModbusServer();

      await server.start();

      client = new ModbusClient(
        '127.0.0.1',
        server.port,
      );

      await client.connect();
    });

    afterEach(async () => {
      client.disconnect();

      await server.stop();
    });

    it(
      'reads holding registers from the server',
      async () => {
        server.registers.writeHoldingRegister(
          100,
          1234,
        );

        server.registers.writeHoldingRegister(
          101,
          5678,
        );

        const values =
          await client.readHoldingRegisters(
            1,
            100,
            2,
          );

        expect(values).toEqual([
          1234,
          5678,
        ]);
      },
    );

    it(
      'returns zero for unset holding registers',
      async () => {
        const values =
          await client.readHoldingRegisters(
            1,
            200,
            3,
          );

        expect(values).toEqual([
          0,
          0,
          0,
        ]);
      },
    );

    it(
      'reads consecutive registers from the requested start address',
      async () => {
        server.registers.writeHoldingRegister(
          50,
          1000,
        );

        server.registers.writeHoldingRegister(
          51,
          2000,
        );

        server.registers.writeHoldingRegister(
          52,
          3000,
        );

        server.registers.writeHoldingRegister(
          53,
          4000,
        );

        const values =
          await client.readHoldingRegisters(
            7,
            51,
            2,
          );

        expect(values).toEqual([
          2000,
          3000,
        ]);
      },
    );
  },
);