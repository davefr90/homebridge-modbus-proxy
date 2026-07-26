import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { ModbusClient } from '../../src/client/ModbusClient.js';
import { RegisterReader } from '../../src/model/RegisterReader.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import type { ValueConverter } from '../../src/model/ValueConverter.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'RegisterReader',
  () => {

    const definition = {

      name:
        'test-register',

      unitId:
        1,

      address:
        100,

      length:
        1,

      function:
        PollFunction.ReadHoldingRegisters,

      dataType:
        RegisterDataType.UInt16,

    } as RegisterDefinition;

    it(
      'reads holding registers',
      async () => {

        const readHoldingRegisters =
          vi.fn(
            async () => [123],
          );

        const client = {

          readHoldingRegisters,

        } as unknown as ModbusClient;

        const convert =
          vi.fn(
            () => 123,
          );

        const converter = {

          convert,

        } as unknown as ValueConverter;

        const reader =
          new RegisterReader(
            client,
            converter,
          );

        await expect(
          reader.read(
            definition,
          ),
        ).resolves.toBe(123);

        expect(
          readHoldingRegisters,
        ).toHaveBeenCalledWith(
          1,
          100,
          1,
        );

        expect(
          convert,
        ).toHaveBeenCalledWith(
          definition,
          Uint16Array.from([123]),
        );

      },
    );

    it(
      'reads input registers',
      async () => {

        const readInputRegisters =
          vi.fn(
            async () => [456],
          );

        const client = {

          readInputRegisters,

        } as unknown as ModbusClient;

        const convert =
          vi.fn(
            () => 456,
          );

        const converter = {

          convert,

        } as unknown as ValueConverter;

        const reader =
          new RegisterReader(
            client,
            converter,
          );

        const inputDefinition = {

          ...definition,

          function:
            PollFunction.ReadInputRegisters,

        } as RegisterDefinition;

        await expect(
          reader.read(
            inputDefinition,
          ),
        ).resolves.toBe(456);

        expect(
          readInputRegisters,
        ).toHaveBeenCalledWith(
          1,
          100,
          1,
        );

        expect(
          convert,
        ).toHaveBeenCalledWith(
          inputDefinition,
          Uint16Array.from([456]),
        );

      },
    );

    it(
      'reads coils',
      async () => {

        const readCoils =
          vi.fn(
            async () => [true],
          );

        const client = {

          readCoils,

        } as unknown as ModbusClient;

        const convert =
          vi.fn();

        const converter = {

          convert,

        } as unknown as ValueConverter;

        const reader =
          new RegisterReader(
            client,
            converter,
          );

        const coilDefinition = {

          ...definition,

          function:
            PollFunction.ReadCoils,

          dataType:
            RegisterDataType.Boolean,

        } as RegisterDefinition;

        await expect(
          reader.read(
            coilDefinition,
          ),
        ).resolves.toBe(true);

        expect(
          readCoils,
        ).toHaveBeenCalledWith(
          1,
          100,
          1,
        );

        expect(
          convert,
        ).not.toHaveBeenCalled();

      },
    );

    it(
      'reads discrete inputs',
      async () => {

        const readDiscreteInputs =
          vi.fn(
            async () => [false],
          );

        const client = {

          readDiscreteInputs,

        } as unknown as ModbusClient;

        const convert =
          vi.fn();

        const converter = {

          convert,

        } as unknown as ValueConverter;

        const reader =
          new RegisterReader(
            client,
            converter,
          );

        const discreteInputDefinition = {

          ...definition,

          function:
            PollFunction.ReadDiscreteInputs,

          dataType:
            RegisterDataType.Boolean,

        } as RegisterDefinition;

        await expect(
          reader.read(
            discreteInputDefinition,
          ),
        ).resolves.toBe(false);

        expect(
          readDiscreteInputs,
        ).toHaveBeenCalledWith(
          1,
          100,
          1,
        );

        expect(
          convert,
        ).not.toHaveBeenCalled();

      },
    );

    it(
      'throws for unsupported poll functions',
      async () => {

        const client = {

        } as unknown as ModbusClient;

        const reader =
          new RegisterReader(
            client,
          );

        const unsupportedDefinition = {

          ...definition,

          function:
            255 as PollFunction,

        } as RegisterDefinition;

        await expect(
          reader.read(
            unsupportedDefinition,
          ),
        ).rejects.toThrow(
          'Unsupported poll function: 255',
        );

      },
    );

  },
);