import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ModbusException } from '../../src/exceptions/ModbusException.js';
import { ModbusExceptionCode } from '../../src/protocol/ModbusExceptionCode.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

describe(
  'Modbus exception handling',
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

    afterEach(() => {
      client.disconnect();
      server.stop();
    });

    it(
      'rejects with ModbusException when an exception response is received',
      async () => {
        await expect(
          client.readHoldingRegisters(
            1,
            0xffff,
            1,
          ),
        ).rejects.toBeInstanceOf(
          ModbusException,
        );

        await expect(
          client.readHoldingRegisters(
            1,
            0xffff,
            1,
          ),
        ).rejects.toMatchObject({
          functionCode: 0x03,
          exceptionCode:
            ModbusExceptionCode.IllegalDataAddress,
        });
      },
    );
    it(
  'rejects Read Input Registers with IllegalDataAddress',
  async () => {
    await expect(
      client.readInputRegisters(
        1,
        0xffff,
        1,
      ),
    ).rejects.toMatchObject({
      functionCode: 0x04,
      exceptionCode:
        ModbusExceptionCode.IllegalDataAddress,
    });
  },
);

it(
  'rejects Write Single Register with IllegalDataAddress',
  async () => {
    await expect(
      client.writeSingleRegister(
        1,
        0xffff,
        1234,
      ),
    ).rejects.toMatchObject({
      functionCode: 0x06,
      exceptionCode:
        ModbusExceptionCode.IllegalDataAddress,
    });
  },
);

it(
  'rejects Write Multiple Registers with IllegalDataAddress',
  async () => {
    await expect(
      client.writeMultipleRegisters(
        1,
        0xffff,
        [
          1234,
        ],
      ),
    ).rejects.toMatchObject({
      functionCode: 0x10,
      exceptionCode:
        ModbusExceptionCode.IllegalDataAddress,
     });
    },
   );
  },
);