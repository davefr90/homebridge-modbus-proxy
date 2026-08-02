import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  RegisterDefinitionBuilder,
} from '../../src/model/RegisterDefinitionBuilder.js';

describe(
  'Register not-implemented values',
  () => {

    it(
      'adds a configured not-implemented value',
      () => {

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(
              2,
            )
            .holdingRegister()
            .address(
              41266,
            )
            .length(
              1,
            )
            .dataType(
              RegisterDataType.Uint16,
            )
            .notImplementedValue(
              0xFFFF,
            )
            .name(
              'Energy Rating',
            )
            .build();

        expect(
          definition.notImplementedValue,
        ).toBe(
          65535,
        );

      },
    );

    it(
      'rejects a non-finite not-implemented value',
      () => {

        expect(
          () =>
            RegisterDefinitionBuilder
              .create()
              .unitId(
                2,
              )
              .holdingRegister()
              .address(
                41266,
              )
              .length(
                1,
              )
              .dataType(
                RegisterDataType.Uint16,
              )
              .notImplementedValue(
                Number.POSITIVE_INFINITY,
              )
              .name(
                'Energy Rating',
              )
              .build(),
        ).toThrow(
          'Invalid not-implemented value: Infinity',
        );

      },
    );

  },
);
