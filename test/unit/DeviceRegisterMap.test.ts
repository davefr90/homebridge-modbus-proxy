import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import type { RegisterDefinition } from '../../src/model/RegisterDefinition.js';
import { RegisterDataType } from '../../src/model/RegisterDataType.js';
import { PollFunction } from '../../src/polling/PollFunction.js';

describe(
  'DeviceRegisterMap',
  () => {

    const createDefinition =
      (
        name: string,
        address: number,
      ): RegisterDefinition => ({

        unitId: 1,

        function:
          PollFunction.ReadHoldingRegisters,

        address,

        length: 1,

        dataType:
          RegisterDataType.Uint16,

        name,

      });

    it(
      'adds and returns register definitions',
      () => {

        const map =
          new DeviceRegisterMap();

        const definition =
          createDefinition(
            'Active Power',
            100,
          );

        map.add(
          'activePower',
          definition,
        );

        expect(
          map.has(
            'activePower',
          ),
        ).toBe(
          true,
        );

        expect(
          map.get(
            'activePower',
          ),
        ).toBe(
          definition,
        );

      },
    );

    it(
      'returns registered property names',
      () => {

        const map =
          new DeviceRegisterMap();

        map.add(
          'activePower',
          createDefinition(
            'Active Power',
            100,
          ),
        );

        map.add(
          'voltage',
          createDefinition(
            'Voltage',
            101,
          ),
        );

        expect(
          map.properties(),
        ).toEqual([
          'activePower',
          'voltage',
        ]);

      },
    );

    it(
      'returns registered definitions',
      () => {

        const map =
          new DeviceRegisterMap();

        const activePower =
          createDefinition(
            'Active Power',
            100,
          );

        const voltage =
          createDefinition(
            'Voltage',
            101,
          );

        map.add(
          'activePower',
          activePower,
        );

        map.add(
          'voltage',
          voltage,
        );

        expect(
          map.definitions(),
        ).toEqual([
          activePower,
          voltage,
        ]);

      },
    );

    it(
      'returns registered entries',
      () => {

        const map =
          new DeviceRegisterMap();

        const activePower =
          createDefinition(
            'Active Power',
            100,
          );

        const voltage =
          createDefinition(
            'Voltage',
            101,
          );

        map.add(
          'activePower',
          activePower,
        );

        map.add(
          'voltage',
          voltage,
        );

        expect(
          map.entries(),
        ).toEqual([
          [
            'activePower',
            activePower,
          ],
          [
            'voltage',
            voltage,
          ],
        ]);

      },
    );

    it(
      'returns the number of registered properties',
      () => {

        const map =
          new DeviceRegisterMap();

        expect(
          map.size(),
        ).toBe(
          0,
        );

        map.add(
          'activePower',
          createDefinition(
            'Active Power',
            100,
          ),
        );

        expect(
          map.size(),
        ).toBe(
          1,
        );

      },
    );

    it(
      'throws for unknown properties',
      () => {

        const map =
          new DeviceRegisterMap();

        expect(
          () =>
            map.get(
              'unknown',
            ),
        ).toThrow(
          'Unknown device property: unknown',
        );

      },
    );

    it(
      'rejects empty property names',
      () => {

        const map =
          new DeviceRegisterMap();

        expect(
          () =>
            map.add(
              '   ',
              createDefinition(
                'Value',
                100,
              ),
            ),
        ).toThrow(
          'Device property must not be empty.',
        );

      },
    );

    it(
      'rejects duplicate properties',
      () => {

        const map =
          new DeviceRegisterMap();

        map.add(
          'activePower',
          createDefinition(
            'Active Power',
            100,
          ),
        );

        expect(
          () =>
            map.add(
              'activePower',
              createDefinition(
                'Other Active Power',
                101,
              ),
            ),
        ).toThrow(
          'Device property already registered: activePower',
        );

      },
    );

  },
);