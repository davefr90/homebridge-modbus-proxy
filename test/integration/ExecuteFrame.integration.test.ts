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

/**
 * Creates request data for reading one register.
 */
function createReadRegisterData(
  address: number,
): Buffer {
  const data = Buffer.alloc(4);

  data.writeUInt16BE(
    address,
    0,
  );

  data.writeUInt16BE(
    1,
    2,
  );

  return data;
}

/**
 * Reads one holding register through a proxy client.
 */
async function readHoldingRegister(
  socket: Socket,
  transactionId: number,
  address: number,
): Promise<number> {
  const request =
    new ModbusTcpFrame(
      transactionId,
      0,
      1,
      ModbusFunctionCode.ReadHoldingRegisters,
      createReadRegisterData(
        address,
      ),
    );

  const responsePromise =
    receiveFrame(socket);

  await sendFrame(
    socket,
    request,
  );

  const response =
    await responsePromise;

  expect(
    response.transactionId,
  ).toBe(transactionId);

  expect(
    response.functionCode,
  ).toBe(
    ModbusFunctionCode.ReadHoldingRegisters,
  );

  expect(
    response.data.length,
  ).toBe(3);

  return response.data.readUInt16BE(
    1,
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

  const proxyClients: Socket[] = [];

  afterEach(async () => {
    for (const proxyClient of proxyClients) {
      if (!proxyClient.destroyed) {
        proxyClient.destroy();
      }
    }

    proxyClients.length = 0;

    if (proxyServer !== undefined) {
      await proxyServer.stop();
    }

    client?.disconnect();

    if (server !== undefined) {
      await server.stop();
    }

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

    const requestFrame =
      new ModbusTcpFrame(
        42,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        createReadRegisterData(100),
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

    const proxyClient =
      await connectTcpClient(
        proxyServer.port,
      );

    proxyClients.push(proxyClient);

    const requestFrame =
      new ModbusTcpFrame(
        123,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        createReadRegisterData(100),
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

  it('handles two concurrent proxy clients', async () => {
    server = new FakeModbusServer();

    await server.start();

    server.registers.writeHoldingRegister(
      100,
      1234,
    );

    server.registers.writeHoldingRegister(
      101,
      5678,
    );

    const device: ManagedDevice = {
      id: 'concurrent-proxy-target',
      name: 'Concurrent Proxy Target',
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

    const [
      firstProxyClient,
      secondProxyClient,
    ] = await Promise.all([
      connectTcpClient(
        proxyServer.port,
      ),
      connectTcpClient(
        proxyServer.port,
      ),
    ]);

    proxyClients.push(
      firstProxyClient,
      secondProxyClient,
    );

    const firstRequest =
      new ModbusTcpFrame(
        201,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        createReadRegisterData(100),
      );

    const secondRequest =
      new ModbusTcpFrame(
        202,
        0,
        1,
        ModbusFunctionCode.ReadHoldingRegisters,
        createReadRegisterData(101),
      );

    const firstResponsePromise =
      receiveFrame(
        firstProxyClient,
      );

    const secondResponsePromise =
      receiveFrame(
        secondProxyClient,
      );

    await Promise.all([
      sendFrame(
        firstProxyClient,
        firstRequest,
      ),
      sendFrame(
        secondProxyClient,
        secondRequest,
      ),
    ]);

    const [
      firstResponse,
      secondResponse,
    ] = await Promise.all([
      firstResponsePromise,
      secondResponsePromise,
    ]);

    expect(
      firstResponse.transactionId,
    ).toBe(201);

    expect(
      firstResponse.functionCode,
    ).toBe(
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    expect(
      firstResponse.data,
    ).toEqual(
      Buffer.from([
        0x02,
        0x04,
        0xd2,
      ]),
    );

    expect(
      secondResponse.transactionId,
    ).toBe(202);

    expect(
      secondResponse.functionCode,
    ).toBe(
      ModbusFunctionCode.ReadHoldingRegisters,
    );

    expect(
      secondResponse.data,
    ).toEqual(
      Buffer.from([
        0x02,
        0x16,
        0x2e,
      ]),
    );
  });

  it('handles five clients with five requests each', async () => {
    server = new FakeModbusServer();

    await server.start();

    const clientCount = 5;
    const requestsPerClient = 5;

    for (
      let clientIndex = 0;
      clientIndex < clientCount;
      clientIndex++
    ) {
      const baseAddress =
        100 + clientIndex * 100;

      const baseValue =
        1000 + clientIndex * 100;

      for (
        let requestIndex = 0;
        requestIndex < requestsPerClient;
        requestIndex++
      ) {
        server.registers.writeHoldingRegister(
          baseAddress + requestIndex,
          baseValue + requestIndex,
        );
      }
    }

    const device: ManagedDevice = {
      id: 'load-test-device',
      name: 'Load Test Device',
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

    const proxyPort =
      proxyServer.port;

    const sockets =
      await Promise.all(
        Array.from(
          {
            length: clientCount,
          },
          () =>
            connectTcpClient(
              proxyPort,
            ),
        ),
      );

    proxyClients.push(...sockets);

    const clientTasks: Promise<void>[] = [];

    for (
      let clientIndex = 0;
      clientIndex < clientCount;
      clientIndex++
    ) {
      const socket =
    sockets[clientIndex];

      if (socket === undefined) {
        throw new Error(
          `Missing proxy socket for client ${clientIndex}.`,
        );
      }

      clientTasks.push(
        (async () => {
          const baseAddress =
        100 + clientIndex * 100;

          const baseValue =
        1000 + clientIndex * 100;

          for (
            let requestIndex = 0;
            requestIndex < requestsPerClient;
            requestIndex++
          ) {
            const transactionId =
          clientIndex * 100 + requestIndex;

            const address =
          baseAddress + requestIndex;

            const expectedValue =
          baseValue + requestIndex;

            const value =
          await readHoldingRegister(
            socket,
            transactionId,
            address,
          );

            expect(value).toBe(
              expectedValue,
            );
          }
        })(),
      );
    }

    await Promise.all(
      clientTasks,
    );
  });
});