import { describe, expect, it } from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';

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

  it('rejects a raw frame when the TCP connection is not open', async () => {
    const client = new ModbusClient(
      '127.0.0.1',
      502,
    );

    const frame = new ModbusTcpFrame(
      42,
      0,
      1,
      ModbusFunctionCode.ReadHoldingRegisters,
      Buffer.from([
        0x00,
        0x00,
        0x00,
        0x01,
      ]),
    );

    await expect(
      client.executeFrame(frame),
    ).rejects.toThrow(
      'TCP socket is not connected',
    );
  });
});