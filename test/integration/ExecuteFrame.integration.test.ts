import { Socket } from 'node:net';

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ModbusClient } from '../../src/client/ModbusClient.js';
import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpEncoder } from '../../src/protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';
import { ModbusTcpFrameParser } from '../../src/protocol/ModbusTcpFrameParser.js';
import { ConnectionManager } from '../../src/proxy/ConnectionManager.js';
import type { ManagedDevice } from '../../src/proxy/ManagedDevice.js';
import { ManagedDeviceRuntime } from '../../src/proxy/ManagedDeviceRuntime.js';
import { ProxyServer } from '../../src/proxy/ProxyServer.js';
import { FakeModbusServer } from '../helpers/FakeModbusServer.js';

/**
 * Opens a TCP connection to the proxy server.
 */
function connectTcpClient(
  port: number,
): Promise<Socket> {
  return new Promise<Socket>(
    (
      resolve,
      reject,
    ) => {
      const socket = new Socket();

      const handleConnect = (): void => {
        socket.removeListener(
          'error',
          handleError,
        );

        resolve(socket);
      };

      const handleError = (
        error: Error,
      ): void => {
        socket.removeListener(
          'connect',
          handleConnect,
        );

        socket.destroy();
        reject(error);
      };

      socket.once(
        'connect',
        handleConnect,
      );

      socket.once(
        'error',
        handleError,
      );

      socket.connect(
        port,
        '127.0.0.1',
      );
    },
  );
}

/**
 * Waits for one complete Modbus TCP frame from a socket.
 */
function receiveFrame(
  socket: Socket,
): Promise<ModbusTcpFrame> {
  const parser =
    new ModbusTcpFrameParser();

  return new Promise<ModbusTcpFrame>(
    (
      resolve,
      reject,
    ) => {
      const timeout =
        setTimeout(
          () => {
            cleanup();

            reject(
              new Error(
                'Timed out while waiting for a proxy response.',
              ),
            );
          },
          2000,
        );

      const cleanup = (): void => {
        clearTimeout(timeout);

        socket.removeListener(
          'data',
          handleData,
        );

        socket.removeListener(
          'error',
          handleError,
        );

        socket.removeListener(
          'close',
          handleClose,
        );
      };

      const handleData = (
        data: Buffer,
      ): void => {
        try {
          const frames =
            parser.push(
              Buffer.from(data),
            );

          const frame =
            frames.at(0);

          if (frame === undefined) {
            return;
          }

          cleanup();
          resolve(frame);
        } catch (error) {
          cleanup();

          reject(
            error instanceof Error
              ? error
              : new Error(
                  String(error),
                ),
          );
        }
      };

      const handleError = (
        error: Error,
      ): void => {
        cleanup();
        reject(error);
      };

      const handleClose = (): void => {
        cleanup();

        reject(
          new Error(
            'Proxy connection closed before a response was received.',
          ),
        );
      };

      socket.on(
        'data',
        handleData,
      );

      socket.once(
        'error',
        handleError,
      );

      socket.once(
        'close',
        handleClose,
      );
    },
  );
}

/**
 * Writes a complete Modbus TCP frame to a socket.
 */
function sendFrame(
  socket: Socket,
  frame: ModbusTcpFrame,
): Promise<void> {
  const buffer =
    ModbusTcpEncoder.encode(
      frame,
    );

  return new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      socket.write(
        buffer,
        (error) => {
          if (error != null) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    },
  );
}

describe('ModbusClient executeFrame', () => {
  let server:
    | FakeModbusServer
    | undefined;

  let client:
    | ModbusClient
    | undefined;

  let proxyServer:
    | ProxyServer
    | undefined;

  let proxyClient:
    | Socket
    | undefined;

  afterEach(async () => {
    if (
      proxyClient !== undefined &&
      !proxyClient.destroyed
    ) {
      proxyClient.destroy();
    }

    if (proxyServer !== undefined) {
      await proxyServer.stop();
    }

    client?.disconnect();

    if (server !== undefined) {
      await server.stop();
    }

    proxyClient = undefined;
    proxyServer = undefined;
    client = undefined;
    server = undefined;
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

  it('forwards a frame through the complete TCP proxy', async () => {
    server = new FakeModbusServer();

    await server.start();

    server.registers.writeHoldingRegister(
      100,
      1234,
    );

    const device: ManagedDevice = {
      id: 'proxy-target',
      name: 'Proxy Target',
      host: '127.0.0.1',
      port: server.port,
      unitId: 1,
    };

    client = new ModbusClient(
      device.host,
      device.port,
    );

    const connectionManager =
      new ConnectionManager(
        new ManagedDeviceRuntime(device),
        client,
      );

    await connectionManager.connect();

    proxyServer =
      new ProxyServer(
        connectionManager,
      );

    await proxyServer.start();

    proxyClient =
      await connectTcpClient(
        proxyServer.port,
      );

    const requestData =
      Buffer.alloc(4);

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
        123,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        requestData,
      );

    const responsePromise =
      receiveFrame(
        proxyClient,
      );

    await sendFrame(
      proxyClient,
      requestFrame,
    );

    const response =
      await responsePromise;

    expect(
      response.transactionId,
    ).toBe(123);

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
});