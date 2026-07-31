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
  'Write Single Coil integration',
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

      await server.stop();
    });

    it(
      'writes a coil',
      async () => {
        await client.writeSingleCoil(
          1,
          100,
          true,
        );

        expect(
          server.coils.readCoil(
            100,
          ),
        ).toBe(true);
      },
    );

    it(
      'clears a coil',
      async () => {
        server.coils.writeCoil(
          100,
          true,
        );

        await client.writeSingleCoil(
          1,
          100,
          false,
        );

        expect(
          server.coils.readCoil(
            100,
          ),
        ).toBe(false);
      },
    );

    it(
      'sends the correct request',
      async () => {
        await client.writeSingleCoil(
          7,
          123,
          true,
        );

        const frame =
          server.getLastFrame();

        expect(frame).toBeDefined();

        expect(
          frame!.unitId,
        ).toBe(7);

        expect(
          frame!.functionCode,
        ).toBe(0x05);

        expect(
          frame!.data.readUInt16BE(0),
        ).toBe(123);

        expect(
          frame!.data.readUInt16BE(2),
        ).toBe(0xff00);
      },
    );
  },
);