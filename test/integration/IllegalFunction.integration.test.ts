import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusTcpEncoder } from '../../src/protocol/ModbusTcpEncoder.js';
import { ModbusTcpDecoder } from '../../src/protocol/ModbusTcpDecoder.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

import net from 'node:net';

describe(
  'Illegal Function integration',
  () => {
    let server: FakeModbusServer;

    beforeEach(async () => {
      server = new FakeModbusServer();

      await server.start();
    });

    afterEach(async () => {
      await server.stop();
    });

    it(
      'returns exception code 0x01 for an unsupported function code',
      async () => {
        const socket =
          net.createConnection(
            server.port,
            '127.0.0.1',
          );

        await new Promise<void>(
          (resolve) => {
            socket.once(
              'connect',
              resolve,
            );
          },
        );

        const request =
          new ModbusTcpFrame(
            1,
            0,
            1,
            0x55 as never,
            Buffer.alloc(0),
          );

        socket.write(
          ModbusTcpEncoder.encode(
            request,
          ),
        );

        const response =
          await new Promise<Buffer>(
            (resolve) => {
              socket.once(
                'data',
                (
                  data,
                ) => {
                  resolve(
                    Buffer.from(data),
                  );
                },
              );
            },
          );

        const frame =
          ModbusTcpDecoder.decode(
            response,
          );

        expect(
          frame.functionCode,
        ).toBe(0xD5);

        expect(
          frame.data.readUInt8(0),
        ).toBe(0x01);

        socket.destroy();
      },
    );
  },
);