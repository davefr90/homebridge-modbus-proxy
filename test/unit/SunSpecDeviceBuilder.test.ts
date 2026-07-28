import {
  describe,
  expect,
  it,
} from 'vitest';

import { SunSpecDeviceBuilder } from '../../src/sunspec/SunSpecDeviceBuilder.js';

describe(
  'SunSpecDeviceBuilder',
  () => {

    it(
      'creates an empty SunSpec device',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .build();

        expect(
          container.models().length,
        ).toBe(
          0,
        );

      },
    );

    it(
      'adds the Common model',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .build();

        expect(
          container.models().length,
        ).toBe(
          1,
        );

        expect(
          container.models()[0].id,
        ).toBe(
          1,
        );

        expect(
          container.models()[0].name,
        ).toBe(
          'Common',
        );

      },
    );

    it(
      'adds inverter model 103',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .build();

        expect(
          container.models().length,
        ).toBe(
          2,
        );

        expect(
          container.models()[1].id,
        ).toBe(
          103,
        );

        expect(
          container.models()[1].name,
        ).toBe(
          'Three-Phase Inverter',
        );

      },
    );

    it(
      'places inverter model 103 after the Common model',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .build();

        const inverterModel =
          container.models()[1];

        const acCurrentScaleFactor =
          inverterModel.registerMap.get(
            'acCurrentScaleFactor',
          );

        expect(
          acCurrentScaleFactor.address,
        ).toBe(
          40076,
        );

      },
    );

    it(
      'adds nameplate model 120',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .model120()
            .build();

        expect(
          container.models().length,
        ).toBe(
          3,
        );

        expect(
          container.models()[2].id,
        ).toBe(
          120,
        );

        expect(
          container.models()[2].name,
        ).toBe(
          'Nameplate Ratings',
        );

      },
    );

    it(
      'places nameplate model 120 after inverter model 103',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .common()
            .model103()
            .model120()
            .build();

        const nameplateModel =
          container.models()[2];

        const derType =
          nameplateModel.registerMap.get(
            'derType',
          );

        expect(
        derType.address,
            ).toBe(
            40124,
        );

      },
    );

    it(
      'uses the configured unit ID for the Common model',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .unitId(
              247,
            )
            .common()
            .build();

        const commonModel =
          container.models()[0];

        const manufacturer =
          commonModel.registerMap.get(
            'manufacturer',
          );

        expect(
          manufacturer.unitId,
        ).toBe(
          247,
        );

      },
    );

    it(
      'uses the configured unit ID for inverter model 103',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .unitId(
              247,
            )
            .common()
            .model103()
            .build();

        const inverterModel =
          container.models()[1];

        const acCurrent =
          inverterModel.registerMap.get(
            'acCurrent',
          );

        expect(
          acCurrent.unitId,
        ).toBe(
          247,
        );

      },
    );

    it(
      'uses the configured unit ID for nameplate model 120',
      () => {

        const container =
          SunSpecDeviceBuilder
            .create()
            .unitId(
              247,
            )
            .common()
            .model103()
            .model120()
            .build();

        const nameplateModel =
          container.models()[2];

        const derType =
          nameplateModel.registerMap.get(
            'derType',
          );

        expect(
          derType.unitId,
        ).toBe(
          247,
        );

      },
    );

    it(
      'rejects unit ID zero',
      () => {

        expect(
          () =>
            SunSpecDeviceBuilder
              .create()
              .unitId(
                0,
              ),
        ).toThrow(
          'Invalid Modbus unit ID: 0',
        );

      },
    );

    it(
      'rejects unit IDs greater than 247',
      () => {

        expect(
          () =>
            SunSpecDeviceBuilder
              .create()
              .unitId(
                248,
              ),
        ).toThrow(
          'Invalid Modbus unit ID: 248',
        );

      },
    );

    it(
      'rejects non-integer unit IDs',
      () => {

        expect(
          () =>
            SunSpecDeviceBuilder
              .create()
              .unitId(
                1.5,
              ),
        ).toThrow(
          'Invalid Modbus unit ID: 1.5',
        );

      },
    );

  },
);