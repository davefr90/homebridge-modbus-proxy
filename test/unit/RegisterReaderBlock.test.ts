import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  ModbusClient,
} from '../../src/client/ModbusClient.js';

import type {
  RegisterDefinition,
} from '../../src/model/RegisterDefinition.js';

import type {
  RegisterGroup,
} from '../../src/model/RegisterGroup.js';

import {
  RegisterReader,
} from '../../src/model/RegisterReader.js';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  PollFunction,
} from '../../src/polling/PollFunction.js';

describe(
  'RegisterReader block reads',
  () => {

    it(
      'reads one holding-register block and decodes its definitions',
      async () => {

        const signedDefinition: RegisterDefinition = {
          unitId: 2,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 100,
          length: 1,
          dataType:
            RegisterDataType.Int16,
          name: 'Signed Value',
        };

        const unsignedDefinition: RegisterDefinition = {
          unitId: 2,
          function:
            PollFunction.ReadHoldingRegisters,
          address: 102,
          length: 2,
          dataType:
            RegisterDataType.Uint32,
          name: 'Unsigned Value',
        };

        const group: RegisterGroup = {
          unitId: 2,
          function:
            PollFunction.ReadHoldingRegisters,
          startAddress: 100,
          length: 4,
          registers: [
            signedDefinition,
            unsignedDefinition,
          ],
        };

        const readHoldingRegisters =
          vi.fn(
            async () => [
              0xFF9C,
              0,
              0x0001,
              0x0002,
            ],
          );

        const reader =
          new RegisterReader(
            {
              readHoldingRegisters,
            } as unknown as ModbusClient,
          );

        const values =
          await reader.readGroup(
            group,
          );

        expect(
          readHoldingRegisters,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          readHoldingRegisters,
        ).toHaveBeenCalledWith(
          2,
          100,
          4,
        );

        expect(
          values.get(
            signedDefinition,
          ),
        ).toBe(
          -100,
        );

        expect(
          values.get(
            unsignedDefinition,
          ),
        ).toBe(
          65538,
        );

      },
    );

  },
);
