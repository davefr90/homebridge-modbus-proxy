import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  RegisterByteOrder,
} from '../../src/model/RegisterByteOrder.js';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  ValueConverter,
} from '../../src/model/ValueConverter.js';

import {
  RegisterGroupBuilder,
} from '../../src/model/RegisterGroupBuilder.js';

import {
  SolarEdgeBatteryModel,
} from '../../src/sunspec/solaredge/SolarEdgeBatteryModel.js';

describe(
  'SolarEdgeBatteryModel',
  () => {

    it(
      'creates all exposed Battery 1 properties',
      () => {

        expect(
          SolarEdgeBatteryModel
            .create(
              2,
            )
            .size(),
        ).toBe(
          21,
        );

      },
    );

    it(
      'maps identification fields from the primary base address',
      () => {

        const registerMap =
          SolarEdgeBatteryModel.create(
            2,
          );

        expect(
          registerMap.get(
            'manufacturer',
          ),
        ).toMatchObject({
          address: 0xE100,
          length: 16,
          dataType:
            RegisterDataType.String,
        });

        expect(
          registerMap.get(
            'model',
          ).address,
        ).toBe(
          0xE110,
        );

        expect(
          registerMap.get(
            'serialNumber',
          ).address,
        ).toBe(
          0xE130,
        );

      },
    );

    it(
      'uses the inverter Modbus unit ID for every property',
      () => {

        const registerMap =
          SolarEdgeBatteryModel.create(
            3,
          );

        expect(
          registerMap
            .definitions()
            .every(
              (definition) =>
                definition.unitId === 3,
            ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'maps battery power as a word-swapped Float32 value',
      () => {

        const power =
          SolarEdgeBatteryModel
            .create(
              2,
            )
            .get(
              'power',
            );

        expect(
          power,
        ).toMatchObject({
          address: 0xE174,
          length: 2,
          dataType:
            RegisterDataType.Float32,
          byteOrder:
            RegisterByteOrder.CDAB,
          unit: 'W',
        });

        expect(
          new ValueConverter()
            .convert(
              power,
              new Uint16Array([
                0x0000,
                0xC393,
              ]),
            ),
        ).toBe(
          -294,
        );

      },
    );

    it(
      'decodes the measured 98 percent state of energy',
      () => {

        const stateOfEnergy =
          SolarEdgeBatteryModel
            .create(
              2,
            )
            .get(
              'stateOfEnergy',
            );

        expect(
          stateOfEnergy.address,
        ).toBe(
          0xE184,
        );

        expect(
          new ValueConverter()
            .convert(
              stateOfEnergy,
              new Uint16Array([
                0x0000,
                0x42C4,
              ]),
            ),
        ).toBe(
          98,
        );

      },
    );

    it(
      'maps battery status as a word-swapped Uint32 value',
      () => {

        const status =
          SolarEdgeBatteryModel
            .create(
              2,
            )
            .get(
              'status',
            );

        expect(
          status,
        ).toMatchObject({
          address: 0xE186,
          length: 2,
          dataType:
            RegisterDataType.Uint32,
          byteOrder:
            RegisterByteOrder.CDAB,
        });

        expect(
          new ValueConverter()
            .convert(
              status,
              new Uint16Array([
                0x0004,
                0x0000,
              ]),
            ),
        ).toBe(
          4,
        );

      },
    );

    it(
      'supports the documented alternate base address',
      () => {

        const registerMap =
          SolarEdgeBatteryModel.create(
            2,
            SolarEdgeBatteryModel.ALTERNATE_BASE_ADDRESS,
          );

        expect(
          registerMap.get(
            'manufacturer',
          ).address,
        ).toBe(
          0xF500,
        );

        expect(
          registerMap.get(
            'power',
          ).address,
        ).toBe(
          0xF574,
        );

      },
    );

    it(
      'configures SolarEdge not-implemented values',
      () => {

        const registerMap =
          SolarEdgeBatteryModel.create(
            2,
          );

        expect(
          registerMap.get(
            'stateOfEnergy',
          ).notImplementedValue,
        ).toBe(
          SolarEdgeBatteryModel.NOT_IMPLEMENTED_FLOAT32,
        );

        expect(
          registerMap.get(
            'status',
          ).notImplementedValue,
        ).toBe(
          0xFFFFFFFF,
        );

      },
    );

    it(
      'keeps all live battery values in one coherent block',
      () => {

        const registerMap =
          SolarEdgeBatteryModel.create(
            2,
          );

        const groups =
          new RegisterGroupBuilder(
            {
              maxGap: 124,
              maxRegistersPerGroup: 125,
            },
          ).build(
            registerMap.definitions(),
          );

        const power =
          registerMap.get(
            'power',
          );

        const liveGroup =
          groups.find(
            (group) =>
              group.registers.includes(
                power,
              ),
          );

        expect(
          groups,
        ).toHaveLength(
          2,
        );

        expect(
          liveGroup,
        ).toBeDefined();

        expect(
          liveGroup?.startAddress,
        ).toBe(
          0xE16C,
        );

        expect(
          liveGroup?.length,
        ).toBe(
          30,
        );

        expect(
          liveGroup?.registers,
        ).toContain(
          registerMap.get(
            'stateOfEnergy',
          ),
        );

        expect(
          liveGroup?.registers,
        ).toContain(
          registerMap.get(
            'status',
          ),
        );

      },
    );

    it(
      'rejects a battery block that exceeds the Modbus address space',
      () => {

        expect(
          () =>
            SolarEdgeBatteryModel.create(
              2,
              65535,
            ),
        ).toThrow(
          'Invalid SolarEdge battery base address: 65535',
        );

      },
    );

  },
);
