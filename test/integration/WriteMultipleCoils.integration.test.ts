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
  'Write Multiple Coils integration',
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
      'writes multiple coils',
      async () => {
        await client.writeMultipleCoils(
          1,
          100,
          [
            true,
            false,
            true,
            true,
            false,
          ],
        );

        expect(
          server.coils.readCoil(100),
        ).toBe(true);

        expect(
          server.coils.readCoil(101),
        ).toBe(false);

        expect(
          server.coils.readCoil(102),
        ).toBe(true);

        expect(
          server.coils.readCoil(103),
        ).toBe(true);

        expect(
          server.coils.readCoil(104),
        ).toBe(false);
      },
    );

    it(
      'overwrites existing coil values',
      async () => {
        server.coils.writeCoil(
          200,
          false,
        );

        server.coils.writeCoil(
          201,
          true,
        );

        server.coils.writeCoil(
          202,
          false,
        );

        await client.writeMultipleCoils(
          1,
          200,
          [
            true,
            false,
            true,
          ],
        );

        expect(
          server.coils.readCoil(200),
        ).toBe(true);

        expect(
          server.coils.readCoil(201),
        ).toBe(false);

        expect(
          server.coils.readCoil(202),
        ).toBe(true);
      },
    );

    it(
      'writes coil values across multiple bytes',
      async () => {
        await client.writeMultipleCoils(
          1,
          300,
          [
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            true,
            true,
          ],
        );

        expect(
          server.coils.readCoil(300),
        ).toBe(true);

        expect(
          server.coils.readCoil(301),
        ).toBe(false);

        expect(
          server.coils.readCoil(302),
        ).toBe(true);

        expect(
          server.coils.readCoil(303),
        ).toBe(false);

        expect(
          server.coils.readCoil(304),
        ).toBe(true);

        expect(
          server.coils.readCoil(305),
        ).toBe(false);

        expect(
          server.coils.readCoil(306),
        ).toBe(true);

        expect(
          server.coils.readCoil(307),
        ).toBe(false);

        expect(
          server.coils.readCoil(308),
        ).toBe(false);

        expect(
          server.coils.readCoil(309),
        ).toBe(true);

        expect(
          server.coils.readCoil(310),
        ).toBe(true);
      },
    );

    it(
      'sends the correct request frame',
      async () => {
        await client.writeMultipleCoils(
          7,
          400,
          [
            true,
            false,
            true,
            true,
            false,
            false,
            true,
            false,
            true,
            true,
          ],
        );

        const frame = server.getLastFrame();

        expect(frame).toBeDefined();

        expect(frame?.unitId).toBe(7);

        expect(frame?.functionCode).toBe(
          ModbusFunctionCode.WriteMultipleCoils,
        );

        expect(
          frame?.data.readUInt16BE(0),
        ).toBe(400);

        expect(
          frame?.data.readUInt16BE(2),
        ).toBe(10);

        expect(
          frame?.data.readUInt8(4),
        ).toBe(2);

        /*
         * First eight coil values:
         *
         * true, false, true, true,
         * false, false, true, false
         *
         * Bits are packed least-significant bit first:
         *
         * 01001101 = 0x4D
         */
        expect(
          frame?.data.readUInt8(5),
        ).toBe(0x4d);

        /*
         * Remaining two coil values:
         *
         * true, true
         *
         * 00000011 = 0x03
         */
        expect(
          frame?.data.readUInt8(6),
        ).toBe(0x03);
      },
    );
  },
);