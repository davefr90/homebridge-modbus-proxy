import { afterEach, describe, expect, it } from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe('FakeModbusServer receive frame', () => {

  let server: FakeModbusServer;

  afterEach(async () => {
    await server.stop();
  });

  it('receives a Modbus request', async () => {

    server = new FakeModbusServer();

    await server.start();

    const client = new ModbusClient(
      '127.0.0.1',
      server.port,
    );

    await client.connect();

    client.readHoldingRegisters(
      1,
      100,
      2,
    ).catch(() => {
      // No response yet.
    });

    await new Promise((resolve) =>
      setTimeout(resolve, 50),
    );

    const frame = server.getLastFrame();

    expect(frame).toBeDefined();

    expect(frame?.unitId).toBe(1);

    await client.disconnect();
  });

});