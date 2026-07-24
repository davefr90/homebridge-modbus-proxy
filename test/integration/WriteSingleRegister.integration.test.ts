import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe(
  'Write Single Register integration',
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
      'writes a single holding register on the server',
      async () => {
        await client.writeSingleRegister(
          1,
          100,
          1234,
        );

        expect(
          server.registers.readHoldingRegister(
            100,
          ),
        ).toBe(1234);
      },
    );

    it(
      'overwrites an existing holding register value',
      async () => {
        server.registers.writeHoldingRegister(
          200,
          1111,
        );

        await client.writeSingleRegister(
          1,
          200,
          2222,
        );

        expect(
          server.registers.readHoldingRegister(
            200,
          ),
        ).toBe(2222);
      },
    );

    it(
      'does not change the input register at the same address',
      async () => {
        server.registers.writeInputRegister(
          300,
          9999,
        );

        await client.writeSingleRegister(
          1,
          300,
          4444,
        );

        expect(
          server.registers.readHoldingRegister(
            300,
          ),
        ).toBe(4444);

        expect(
          server.registers.readInputRegister(
            300,
          ),
        ).toBe(9999);
      },
    );

    it(
      'sends the correct function code, unit ID, address and value',
      async () => {
        await client.writeSingleRegister(
          7,
          400,
          54321,
        );

        const frame = server.getLastFrame();

        expect(frame).toBeDefined();

        expect(frame?.unitId).toBe(7);

        expect(frame?.functionCode).toBe(
          ModbusFunctionCode.WriteSingleRegister,
        );

        expect(
          frame?.data.readUInt16BE(0),
        ).toBe(400);

        expect(
          frame?.data.readUInt16BE(2),
        ).toBe(54321);
      },
    );
  },
);