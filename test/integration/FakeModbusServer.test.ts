import { afterEach, describe, expect, it } from 'vitest';

import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe('FakeModbusServer', () => {
  let server: FakeModbusServer | undefined;

  afterEach(async () => {
    if (server !== undefined) {
      await server.stop();
    }
  });

  it('starts successfully', async () => {
    server = new FakeModbusServer();

    await server.start();

    expect(server.port).toBeGreaterThan(0);
  });

  it('clears the register bank when stopped', async () => {
    server = new FakeModbusServer();

    await server.start();

    server.registers.writeHoldingRegister(
      100,
      1234,
    );

    expect(
      server.registers.readHoldingRegister(
        100,
      ),
    ).toBe(1234);

    await server.stop();

    await server.start();

    expect(
      server.registers.readHoldingRegister(
        100,
      ),
    ).toBe(0);
  });

  it('throws when started twice', async () => {
    server = new FakeModbusServer();

    await server.start();

    await expect(
      server.start(),
    ).rejects.toThrow();
  });
});