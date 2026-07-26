import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceDefinitionBuilder } from '../../src/device/DeviceDefinitionBuilder.js';
import { RegisterDefinitionBuilder } from '../../src/model/RegisterDefinitionBuilder.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';

describe(
  'DeviceDefinitionBuilder',
  () => {

    it(
      'builds a complete device definition',
      () => {

        const definition =
          DeviceDefinitionBuilder
            .create()
            .manufacturer(
              'SolarEdge',
            )
            .model(
              'SE10K',
            )
            .name(
              'SolarEdge Hybrid',
            )
            .register(
              'activePower',

              RegisterDefinitionBuilder
                .create()
                .unitId(1)
                .holdingRegister()
                .address(40083)
                .length(2)
                .dataType(RegisterDataType.Uint32)
                .name('Active Power')
                .unit('W')
                .build(),
            )
            .build();

        expect(
          definition.info.manufacturer,
        ).toBe(
          'SolarEdge',
        );

        expect(
          definition.info.model,
        ).toBe(
          'SE10K',
        );

        expect(
          definition.registerMap.has(
            'activePower',
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'rejects missing manufacturer',
      () => {

        expect(
          () =>

            DeviceDefinitionBuilder
              .create()
              .model(
                'SE10K',
              )
              .name(
                'SolarEdge',
              )
              .build(),

        ).toThrow(
          'Manufacturer is required.',
        );

      },
    );

    it(
      'rejects missing model',
      () => {

        expect(
          () =>

            DeviceDefinitionBuilder
              .create()
              .manufacturer(
                'SolarEdge',
              )
              .name(
                'SolarEdge',
              )
              .build(),

        ).toThrow(
          'Model is required.',
        );

      },
    );

    it(
      'rejects missing device name',
      () => {

        expect(
          () =>

            DeviceDefinitionBuilder
              .create()
              .manufacturer(
                'SolarEdge',
              )
              .model(
                'SE10K',
              )
              .build(),

        ).toThrow(
          'Device name is required.',
        );

      },
    );

  },
);