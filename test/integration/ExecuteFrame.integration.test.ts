import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe('ModbusClient executeFrame', () => {
  let server:
    | FakeModbusServer
    | undefined;

  let client:
    | ModbusClient
    | undefined;

  afterEach(async () => {
    client?.disconnect();

    if (server !== undefined) {
      await server.stop();
    }
  });

  it('forwards a raw frame and restores its transaction identifier', async () => {
    server = new FakeModbusServer();

    await server.start();

    server.registers.writeHoldingRegister(
      100,
      1234,
    );

    client = new ModbusClient(
      '127.0.0.1',
      server.port,
    );

    await client.connect();

    const requestData = Buffer.alloc(4);

    requestData.writeUInt16BE(
      100,
      0,
    );

    requestData.writeUInt16BE(
      1,
      2,
    );

    const requestFrame =
      new ModbusTcpFrame(
        42,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        requestData,
      );

    const response =
      await client.executeFrame(
        requestFrame,
      );

    expect(
      response.transactionId,
    ).toBe(42);

    expect(
      response.protocolId,
    ).toBe(0);

    expect(
      response.unitId,
    ).toBe(1);

    expect(
      response.functionCode,
    ).toBe(
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    expect(
      response.data,
    ).toEqual(
      Buffer.from([
        0x02,
        0x04,
        0xd2,
      ]),
    );
  });

  it('returns Modbus exception responses unchanged', async () => {
    server = new FakeModbusServer();

    await server.start();

    client = new ModbusClient(
      '127.0.0.1',
      server.port,
    );

    await client.connect();

    const requestFrame =
      new ModbusTcpFrame(
        77,
        0,
        1,
        0x7f as ModbusFunctionCode,
        Buffer.alloc(0),
      );

    const response =
      await client.executeFrame(
        requestFrame,
      );

    expect(
      response.transactionId,
    ).toBe(77);

    expect(
      response.functionCode,
    ).toBe(0xff);

    expect(
      response.data.length,
    ).toBe(1);
  });
});