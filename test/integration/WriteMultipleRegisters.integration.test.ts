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
  'Write Multiple Registers integration',
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
      'writes multiple holding registers',
      async () => {
        await client.writeMultipleRegisters(
          1,
          100,
          [
            1111,
            2222,
            3333,
          ],
        );

        expect(
          server.registers.readHoldingRegister(
            100,
          ),
        ).toBe(1111);

        expect(
          server.registers.readHoldingRegister(
            101,
          ),
        ).toBe(2222);

        expect(
          server.registers.readHoldingRegister(
            102,
          ),
        ).toBe(3333);
      },
    );

    it(
      'overwrites existing register values',
      async () => {
        server.registers.writeHoldingRegister(
          200,
          1,
        );

        server.registers.writeHoldingRegister(
          201,
          2,
        );

        await client.writeMultipleRegisters(
          1,
          200,
          [
            10,
            20,
          ],
        );

        expect(
          server.registers.readHoldingRegister(
            200,
          ),
        ).toBe(10);

        expect(
          server.registers.readHoldingRegister(
            201,
          ),
        ).toBe(20);
      },
    );

    it(
      'does not modify input registers',
      async () => {
        server.registers.writeInputRegister(
          300,
          999,
        );

        await client.writeMultipleRegisters(
          1,
          300,
          [
            500,
          ],
        );

        expect(
          server.registers.readHoldingRegister(
            300,
          ),
        ).toBe(500);

        expect(
          server.registers.readInputRegister(
            300,
          ),
        ).toBe(999);
      },
    );

    it(
      'sends the correct request frame',
      async () => {
        await client.writeMultipleRegisters(
          7,
          400,
          [
            100,
            200,
            300,
          ],
        );

        const frame = server.getLastFrame();

        expect(frame).toBeDefined();

        expect(frame?.unitId).toBe(7);

        expect(frame?.functionCode).toBe(
          ModbusFunctionCode.WriteMultipleRegisters,
        );

        expect(
          frame?.data.readUInt16BE(0),
        ).toBe(400);

        expect(
          frame?.data.readUInt16BE(2),
        ).toBe(3);

        expect(
          frame?.data.readUInt8(4),
        ).toBe(6);

        expect(
          frame?.data.readUInt16BE(5),
        ).toBe(100);

        expect(
          frame?.data.readUInt16BE(7),
        ).toBe(200);

        expect(
          frame?.data.readUInt16BE(9),
        ).toBe(300);
      },
    );
  },
);