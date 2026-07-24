import { describe, expect, it } from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';

describe('ModbusClient', () => {
  it('starts disconnected', () => {
    const client = new ModbusClient(
      '127.0.0.1',
      502,
    );

    expect(client.isConnected).toBe(false);
  });

  it('rejects a request when the TCP connection is not open', async () => {
    const client = new ModbusClient(
      '127.0.0.1',
      502,
    );

    await expect(
      client.readHoldingRegisters(
        1,
        0,
        1,
      ),
    ).rejects.toThrow(
      'TCP socket is not connected',
    );
  });
});