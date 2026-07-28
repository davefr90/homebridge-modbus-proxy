import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  CompositeDeviceRegisterMap,
} from '../../src/device/CompositeDeviceRegisterMap.js';

import {
  DeviceRegisterMap,
} from '../../src/device/DeviceRegisterMap.js';

import {
  RegisterDataType,
} from '../../src/model/RegisterDataType.js';

import {
  RegisterDefinitionBuilder,
} from '../../src/model/RegisterDefinitionBuilder.js';

describe(
  'CompositeDeviceRegisterMap',
  () => {

    it(
      'creates an empty composite register map',
      () => {

        const map =
          CompositeDeviceRegisterMap
            .create();

        expect(
          map.size(),
        ).toBe(
          0,
        );

        expect(
          map.namespaceCount(),
        ).toBe(
          0,
        );

        expect(
          map.properties(),
        ).toEqual(
          [],
        );

      },
    );

    it(
      'adds one register map under a namespace',
      () => {

        const source =
          new DeviceRegisterMap();

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40004)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Manufacturer',
            )
            .build();

        source.add(
          'manufacturer',
          definition,
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'common',
              source,
            );

        expect(
          composite.size(),
        ).toBe(
          1,
        );

        expect(
          composite.has(
            'common.manufacturer',
          ),
        ).toBe(
          true,
        );

        expect(
          composite.get(
            'common.manufacturer',
          ),
        ).toBe(
          definition,
        );

      },
    );

    it(
      'combines multiple register maps',
      () => {

        const common =
          new DeviceRegisterMap();

        common.add(
          'manufacturer',
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40004)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Manufacturer',
            )
            .build(),
        );

        const inverter =
          new DeviceRegisterMap();

        inverter.add(
          'acPower',
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40090)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power',
            )
            .build(),
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'common',
              common,
            )
            .addMap(
              'inverter',
              inverter,
            );

        expect(
          composite.properties(),
        ).toEqual([
          'common.manufacturer',
          'inverter.acPower',
        ]);

        expect(
          composite.size(),
        ).toBe(
          2,
        );

        expect(
          composite.namespaceNames(),
        ).toEqual([
          'common',
          'inverter',
        ]);

      },
    );

    it(
      'returns all qualified entries',
      () => {

        const source =
          new DeviceRegisterMap();

        const firstDefinition =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40004)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Manufacturer',
            )
            .build();

        const secondDefinition =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40052)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Serial Number',
            )
            .build();

        source.add(
          'manufacturer',
          firstDefinition,
        );

        source.add(
          'serialNumber',
          secondDefinition,
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'common',
              source,
            );

        expect(
          composite.entries(),
        ).toEqual([
          [
            'common.manufacturer',
            firstDefinition,
          ],
          [
            'common.serialNumber',
            secondDefinition,
          ],
        ]);

      },
    );

    it(
      'returns all register definitions',
      () => {

        const source =
          new DeviceRegisterMap();

        const definition =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40004)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Manufacturer',
            )
            .build();

        source.add(
          'manufacturer',
          definition,
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'common',
              source,
            );

        expect(
          composite.definitions(),
        ).toEqual([
          definition,
        ]);

      },
    );

    it(
      'qualifies dynamic scale-property references',
      () => {

        const source =
          new DeviceRegisterMap();

        const scaleFactor =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40091)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power Scale Factor',
            )
            .build();

        const power =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40090)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power',
            )
            .scaleProperty(
              'acPowerScaleFactor',
            )
            .build();

        source.add(
          'acPower',
          power,
        );

        source.add(
          'acPowerScaleFactor',
          scaleFactor,
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'inverter',
              source,
            );

        const qualifiedPower =
          composite.get(
            'inverter.acPower',
          );

        expect(
          qualifiedPower
            .scaleProperty,
        ).toBe(
          'inverter.acPowerScaleFactor',
        );

        expect(
          composite.has(
            qualifiedPower
              .scaleProperty!,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'does not modify the source register definition',
      () => {

        const source =
          new DeviceRegisterMap();

        const power =
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40090)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power',
            )
            .scaleProperty(
              'acPowerScaleFactor',
            )
            .build();

        source.add(
          'acPower',
          power,
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'inverter',
              source,
            );

        expect(
          power.scaleProperty,
        ).toBe(
          'acPowerScaleFactor',
        );

        expect(
          composite
            .get(
              'inverter.acPower',
            )
            .scaleProperty,
        ).toBe(
          'inverter.acPowerScaleFactor',
        );

      },
    );

    it(
      'supports repeated model instances using different namespaces',
      () => {

        const firstInverter =
          new DeviceRegisterMap();

        firstInverter.add(
          'acPower',
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(41000)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power',
            )
            .build(),
        );

        const secondInverter =
          new DeviceRegisterMap();

        secondInverter.add(
          'acPower',
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(42000)
            .length(1)
            .dataType(
              RegisterDataType.Int16,
            )
            .name(
              'AC Power',
            )
            .build(),
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'inverter1',
              firstInverter,
            )
            .addMap(
              'inverter2',
              secondInverter,
            );

        expect(
          composite.has(
            'inverter1.acPower',
          ),
        ).toBe(
          true,
        );

        expect(
          composite.has(
            'inverter2.acPower',
          ),
        ).toBe(
          true,
        );

        expect(
          composite
            .get(
              'inverter1.acPower',
            )
            .address,
        ).toBe(
          41000,
        );

        expect(
          composite
            .get(
              'inverter2.acPower',
            )
            .address,
        ).toBe(
          42000,
        );

      },
    );

    it(
      'rejects an empty namespace',
      () => {

        const composite =
          CompositeDeviceRegisterMap
            .create();

        expect(
          () =>
            composite.addMap(
              '   ',
              new DeviceRegisterMap(),
            ),
        ).toThrow(
          'Device register-map namespace must not be empty.',
        );

      },
    );

    it(
      'rejects a namespace containing a dot',
      () => {

        const composite =
          CompositeDeviceRegisterMap
            .create();

        expect(
          () =>
            composite.addMap(
              'inverter.primary',
              new DeviceRegisterMap(),
            ),
        ).toThrow(
          'Device register-map namespace must not contain a dot: inverter.primary',
        );

      },
    );

    it(
      'rejects a duplicate namespace',
      () => {

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              'common',
              new DeviceRegisterMap(),
            );

        expect(
          () =>
            composite.addMap(
              'common',
              new DeviceRegisterMap(),
            ),
        ).toThrow(
          'Device register-map namespace already exists: common',
        );

      },
    );

    it(
      'normalizes surrounding namespace whitespace',
      () => {

        const source =
          new DeviceRegisterMap();

        source.add(
          'manufacturer',
          RegisterDefinitionBuilder
            .create()
            .unitId(1)
            .holdingRegister()
            .address(40004)
            .length(16)
            .dataType(
              RegisterDataType.String,
            )
            .name(
              'Manufacturer',
            )
            .build(),
        );

        const composite =
          CompositeDeviceRegisterMap
            .create()
            .addMap(
              '  common  ',
              source,
            );

        expect(
          composite.has(
            'common.manufacturer',
          ),
        ).toBe(
          true,
        );

        expect(
          composite.hasNamespace(
            'common',
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'remains compatible with DeviceRegisterMap',
      () => {

        const composite =
          CompositeDeviceRegisterMap
            .create();

        const registerMap:
          DeviceRegisterMap =
          composite;

        expect(
          registerMap,
        ).toBe(
          composite,
        );

      },
    );

  },
);