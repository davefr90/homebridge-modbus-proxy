import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { ModbusClient } from '../../src/client/ModbusClient.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { RegisterWriter } from '../../src/model/RegisterWriter.js';
import type { ValueEncoder } from '../../src/model/ValueEncoder.js';
import type { ValueValidator } from '../../src/model/ValueValidator.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'RegisterWriter',
  () => {

    function definition(
      dataType = RegisterDataType.Uint16,
      length = 1,
    ): RegisterDefinition {

      return {
        unitId: 2,
        function:
          PollFunction.ReadHoldingRegisters,
        address: 100,
        length,
        dataType,
        name: 'Test register',
      };

    }

    it(
      'can be instantiated',
      () => {

        const client =
          {} as ModbusClient;

        expect(
          new RegisterWriter(client),
        ).toBeInstanceOf(RegisterWriter);

      },
    );

    it(
      'validates the value before encoding it',
      async () => {

        const executionOrder: string[] =
          [];

        const validator = {
          validate: vi.fn(
            () => {
              executionOrder.push(
                'validate',
              );
            },
          ),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(
            () => {
              executionOrder.push(
                'encode',
              );

              return new Uint16Array([
                123,
              ]);
            },
          ),
        } as unknown as ValueEncoder;

        const client = {
          writeSingleRegister: vi.fn(
            async () => {
              executionOrder.push(
                'write',
              );
            },
          ),
        } as unknown as ModbusClient;

        const writer =
          new RegisterWriter(
            client,
            validator,
            encoder,
          );

        const registerDefinition =
          definition();

        await writer.write(
          registerDefinition,
          123,
        );

        expect(
          executionOrder,
        ).toEqual([
          'validate',
          'encode',
          'write',
        ]);

        expect(
          validator.validate,
        ).toHaveBeenCalledWith(
          registerDefinition,
          123,
        );

      },
    );

    it(
      'writes one encoded register using function code 06',
      async () => {

        const validator = {
          validate: vi.fn(),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(
            () =>
              new Uint16Array([
                0x1234,
              ]),
          ),
        } as unknown as ValueEncoder;

        const writeSingleRegister =
          vi.fn(
            async () => undefined,
          );

        const client = {
          writeSingleRegister,
        } as unknown as ModbusClient;

        const writer =
          new RegisterWriter(
            client,
            validator,
            encoder,
          );

        await writer.write(
          definition(),
          0x1234,
        );

        expect(
          writeSingleRegister,
        ).toHaveBeenCalledTimes(1);

        expect(
          writeSingleRegister,
        ).toHaveBeenCalledWith(
          2,
          100,
          0x1234,
        );

      },
    );

    it(
      'does not encode or write when validation fails',
      async () => {

        const validationError =
          new Error(
            'Invalid value.',
          );

        const validator = {
          validate: vi.fn(
            () => {
              throw validationError;
            },
          ),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(),
        } as unknown as ValueEncoder;

        const client = {
          writeSingleRegister:
            vi.fn(),
        } as unknown as ModbusClient;

        const writer =
          new RegisterWriter(
            client,
            validator,
            encoder,
          );

        await expect(
          writer.write(
            definition(),
            65536,
          ),
        ).rejects.toBe(
          validationError,
        );

        expect(
          encoder.encode,
        ).not.toHaveBeenCalled();

        expect(
          client.writeSingleRegister,
        ).not.toHaveBeenCalled();

      },
    );

    it(
      'writes multiple encoded registers using function code 16',
      async () => {

        const validator = {
          validate: vi.fn(),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(
            () =>
              new Uint16Array([
                0x1234,
                0x5678,
              ]),
          ),
        } as unknown as ValueEncoder;

        const writeSingleRegister =
      vi.fn();

        const writeMultipleRegisters =
      vi.fn(
        async () => undefined,
      );

        const client = {
          writeSingleRegister,
          writeMultipleRegisters,
        } as unknown as ModbusClient;

        const writer =
      new RegisterWriter(
        client,
        validator,
        encoder,
      );

        await writer.write(
          definition(
            RegisterDataType.Uint32,
            2,
          ),
          0x12345678,
        );

        expect(
          writeSingleRegister,
        ).not.toHaveBeenCalled();

        expect(
          writeMultipleRegisters,
        ).toHaveBeenCalledTimes(1);

        expect(
          writeMultipleRegisters,
        ).toHaveBeenCalledWith(
          2,
          100,
          [
            0x1234,
            0x5678,
          ],
        );

      },
    );

    it(
      'forwards multiple register write errors',
      async () => {

        const error =
      new Error(
        'Write failed.',
      );

        const validator = {
          validate: vi.fn(),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(
            () =>
              new Uint16Array([
                1,
                2,
              ]),
          ),
        } as unknown as ValueEncoder;

        const client = {
          writeSingleRegister:
        vi.fn(),

          writeMultipleRegisters:
        vi.fn(
          async () => {
            throw error;
          },
        ),
        } as unknown as ModbusClient;

        const writer =
      new RegisterWriter(
        client,
        validator,
        encoder,
      );

        await expect(
          writer.write(
            definition(
              RegisterDataType.Uint32,
              2,
            ),
            123,
          ),
        ).rejects.toBe(error);

      },
    );

    it(
      'forwards Modbus client write errors',
      async () => {

        const writeError =
          new Error(
            'Write failed.',
          );

        const validator = {
          validate: vi.fn(),
        } as unknown as ValueValidator;

        const encoder = {
          encode: vi.fn(
            () =>
              new Uint16Array([
                123,
              ]),
          ),
        } as unknown as ValueEncoder;

        const client = {
          writeSingleRegister:
            vi.fn(
              async () => {
                throw writeError;
              },
            ),
        } as unknown as ModbusClient;

        const writer =
          new RegisterWriter(
            client,
            validator,
            encoder,
          );

        await expect(
          writer.write(
            definition(),
            123,
          ),
        ).rejects.toBe(
          writeError,
        );

      },
    );

  },
);