import {
  describe,
  expect,
  it,
} from 'vitest';

import { PollFunction } from '../../src/polling/PollFunction.js';
import { RegisterByteOrder } from '../../src/model/RegisterByteOrder.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { RegisterDefinitionBuilder } from '../../src/model/RegisterDefinitionBuilder.js';

describe(
  'RegisterDefinitionBuilder',
  () => {

    it(
      'builds a complete register definition',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .holdingRegister()
            .address(
              40083,
            )
            .length(
              2,
            )
            .dataType(
              RegisterDataType.Uint32,
            )
            .byteOrder(
              RegisterByteOrder.CDAB,
            )
            .pollIntervalMs(
              5000,
            )
            .scale(
              0.1,
            )
            .writable()
            .name(
              'Active power',
            )
            .unit(
              'W',
            )
            .build();

        expect(
          definition,
        ).toEqual({

          unitId: 1,

          function:
            PollFunction.ReadHoldingRegisters,

          address: 40083,

          length: 2,

          dataType:
            RegisterDataType.Uint32,

          byteOrder:
            RegisterByteOrder.CDAB,

          pollIntervalMs: 5000,

          scale: 0.1,

          writable: true,

          name: 'Active power',

          unit: 'W',

        });

      },
    );

    it(
      'builds an input register',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .inputRegister()
            .address(
              10,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Uint16,
            )
            .name(
              'Voltage',
            )
            .build();

        expect(
          definition.function,
        ).toBe(
          PollFunction.ReadInputRegisters,
        );

      },
    );

    it(
      'builds a coil',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .coil()
            .address(
              20,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Boolean,
            )
            .name(
              'Enabled',
            )
            .build();

        expect(
          definition.function,
        ).toBe(
          PollFunction.ReadCoils,
        );

      },
    );

    it(
      'builds a discrete input',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .discreteInput()
            .address(
              30,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Boolean,
            )
            .name(
              'Fault',
            )
            .build();

        expect(
          definition.function,
        ).toBe(
          PollFunction.ReadDiscreteInputs,
        );

      },
    );

    it(
      'supports an explicit poll function',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .function(
              PollFunction.ReadHoldingRegisters,
            )
            .address(
              1,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'Value',
            )
            .build();

        expect(
          definition.function,
        ).toBe(
          PollFunction.ReadHoldingRegisters,
        );

      },
    );

    it(
      'does not add optional properties when they are not configured',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              1,
            )
            .holdingRegister()
            .address(
              1,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Uint16,
            )
            .name(
              'Value',
            )
            .build();

        expect(
          definition.byteOrder,
        ).toBeUndefined();

        expect(
          definition.pollIntervalMs,
        ).toBeUndefined();

        expect(
          definition.scale,
        ).toBeUndefined();

        expect(
          definition.writable,
        ).toBeUndefined();

        expect(
          definition.unit,
        ).toBeUndefined();

      },
    );

    it(
      'rejects a missing unit id',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Register unit id is required.',
        );

      },
    );

    it(
      'rejects a missing function',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Register function is required.',
        );

      },
    );

    it(
      'rejects a missing address',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Register address is required.',
        );

      },
    );

    it(
      'rejects a missing length',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Register length is required.',
        );

      },
    );

    it(
      'rejects a missing data type',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Register data type is required.',
        );

      },
    );

    it(
      'rejects a missing name',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .build(),
        ).toThrow(
          'Register name is required.',
        );

      },
    );

    it(
      'rejects an invalid unit id',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                248,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Invalid Modbus unit id: 248',
        );

      },
    );

    it(
      'rejects an invalid address',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                -1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Invalid register address: -1',
        );

      },
    );

    it(
      'rejects an invalid register length',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                0,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Invalid register length: 0',
        );

      },
    );

    it(
      'rejects an invalid polling interval',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .pollIntervalMs(
                0,
              )
              .name(
                'Value',
              )
              .build(),
        ).toThrow(
          'Invalid poll interval: 0',
        );

      },
    );

    it(
      'rejects an empty register name',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                1,
              )
              .holdingRegister()
              .address(
                1,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .name(
                '   ',
              )
              .build(),
        ).toThrow(
          'Register name must not be empty.',
        );

      },
    );

  },
);