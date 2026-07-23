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
  'Read Input Registers integration',
  () => {
    let server: FakeModbusServer;
    let client: ModbusClient;

    /**
     * Before every test:
     *
     * 1. Create a new fake Modbus TCP server
     * 2. Start it on a free local TCP port
     * 3. Create a Modbus client
     * 4. Connect the client to the fake server
     */
    beforeEach(async () => {
      server = new FakeModbusServer();

      await server.start();

      client = new ModbusClient(
        '127.0.0.1',
        server.port,
      );

      await client.connect();
    });

    /**
     * After every test:
     *
     * 1. Disconnect the client
     * 2. Stop the fake server
     * 3. Clear all registers and sockets
     */
    afterEach(async () => {
      client.disconnect();

      await server.stop();
    });

    it(
      'reads input registers from the server',
      async () => {
        /*
         * Prepare two Input Registers inside
         * the simulated Modbus device.
         */
        server.registers.writeInputRegister(
          100,
          1234,
        );

        server.registers.writeInputRegister(
          101,
          5678,
        );

        /*
         * Read two Input Registers beginning
         * at address 100 from Unit ID 1.
         */
        const values =
          await client.readInputRegisters(
            1,
            100,
            2,
          );

        /*
         * The values must arrive in the same order
         * in which the registers were requested.
         */
        expect(values).toEqual([
          1234,
          5678,
        ]);
      },
    );

    it(
      'returns zero for unset input registers',
      async () => {
        /*
         * Uint16Array initializes all register values
         * with zero.
         *
         * No values are written before this request.
         */
        const values =
          await client.readInputRegisters(
            1,
            200,
            3,
          );

        expect(values).toEqual([
          0,
          0,
          0,
        ]);
      },
    );

    it(
      'reads consecutive input registers from the requested address',
      async () => {
        /*
         * Prepare four consecutive Input Registers.
         */
        server.registers.writeInputRegister(
          50,
          1000,
        );

        server.registers.writeInputRegister(
          51,
          2000,
        );

        server.registers.writeInputRegister(
          52,
          3000,
        );

        server.registers.writeInputRegister(
          53,
          4000,
        );

        /*
         * Start reading at address 51.
         *
         * Therefore addresses 51 and 52 must be returned.
         */
        const values =
          await client.readInputRegisters(
            7,
            51,
            2,
          );

        expect(values).toEqual([
          2000,
          3000,
        ]);
      },
    );

    it(
      'keeps input registers separate from holding registers',
      async () => {
        /*
         * Store different values at the same numerical address.
         *
         * Modbus Holding Registers and Input Registers are
         * independent address spaces.
         */
        server.registers.writeHoldingRegister(
          300,
          1111,
        );

        server.registers.writeInputRegister(
          300,
          2222,
        );

        /*
         * Function Code 0x04 must read from the
         * Input Register area only.
         */
        const values =
          await client.readInputRegisters(
            1,
            300,
            1,
          );

        expect(values).toEqual([
          2222,
        ]);
      },
    );
  },
);