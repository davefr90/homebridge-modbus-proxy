import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { RegisterDefinitionBuilder } from '../../src/model/RegisterDefinitionBuilder.js';
import { SunSpecModelBuilder } from '../../src/sunspec/SunSpecModelBuilder.js';

describe(
  'SunSpecModelBuilder',
  () => {

    it(
      'requires a model id',
      () => {

        expect(
          () =>
            SunSpecModelBuilder
              .create()
              .name(
                'Test Model',
              )
              .build(),
        ).toThrow(
          'SunSpec model id is required.',
        );

      },
    );

    it(
      'requires a model name',
      () => {

        expect(
          () =>
            SunSpecModelBuilder
              .create()
              .id(
                123,
              )
              .build(),
        ).toThrow(
          'SunSpec model name is required.',
        );

      },
    );

    it(
      'creates a model',
      () => {

        const register =
  RegisterDefinitionBuilder
    .create()
    .unitId(
      1,
    )
    .holdingRegister()
    .address(
      40000,
    )
    .length(
      1,
    )
    .dataType(
      RegisterDataType.Uint16,
    )
    .name(
      'Test Register',
    )
    .build();

        const model =
          SunSpecModelBuilder
            .create()
            .id(
              123,
            )
            .name(
              'Test Model',
            )
            .register(
              'test',
              register,
            )
            .build();

        expect(
          model.id,
        ).toBe(
          123,
        );

        expect(
          model.name,
        ).toBe(
          'Test Model',
        );

        expect(
          model.registerMap.size(),
        ).toBe(
          1,
        );

        expect(
          model.registerMap.get(
            'test',
          ),
        ).toBe(
          register,
        );

      },
    );

  },
);