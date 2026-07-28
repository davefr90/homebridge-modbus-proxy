import {
  describe,
  expect,
  it,
} from 'vitest';

import { DeviceRegisterMap } from '../../src/device/DeviceRegisterMap.js';
import { SunSpecModel } from '../../src/sunspec/SunSpecModel.js';
import { SunSpecModelContainer } from '../../src/sunspec/SunSpecModelContainer.js';

describe(
  'SunSpecModelContainer',
  () => {

    const createModel =
      (
        id: number,
        name: string,
      ): SunSpecModel =>
        new SunSpecModel(
          id,
          name,
          new DeviceRegisterMap(),
        );

    it(
      'adds models',
      () => {

        const container =
          new SunSpecModelContainer();

        container
          .add(
            createModel(
              1,
              'Common',
            ),
          )
          .add(
            createModel(
              120,
              'Inverter',
            ),
          );

        expect(
          container.size(),
        ).toBe(
          2,
        );

      },
    );

    it(
      'returns models',
      () => {

        const model =
          createModel(
            120,
            'Inverter',
          );

        const container =
          new SunSpecModelContainer();

        container.add(
          model,
        );

        expect(
          container.get(
            120,
          ),
        ).toBe(
          model,
        );

      },
    );

    it(
      'checks whether a model exists',
      () => {

        const container =
          new SunSpecModelContainer();

        container.add(
          createModel(
            1,
            'Common',
          ),
        );

        expect(
          container.has(
            1,
          ),
        ).toBe(
          true,
        );

        expect(
          container.has(
            120,
          ),
        ).toBe(
          false,
        );

      },
    );

    it(
      'returns all models',
      () => {

        const container =
          new SunSpecModelContainer();

        container
          .add(
            createModel(
              1,
              'Common',
            ),
          )
          .add(
            createModel(
              120,
              'Inverter',
            ),
          );

        expect(
          container.models(),
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'rejects duplicate model ids',
      () => {

        const container =
          new SunSpecModelContainer();

        container.add(
          createModel(
            1,
            'Common',
          ),
        );

        expect(
          () =>
            container.add(
              createModel(
                1,
                'Another Common',
              ),
            ),
        ).toThrow(
          'SunSpec model already exists: 1',
        );

      },
    );

    it(
      'throws for unknown models',
      () => {

        const container =
          new SunSpecModelContainer();

        expect(
          () =>
            container.get(
              999,
            ),
        ).toThrow(
          'Unknown SunSpec model: 999',
        );

      },
    );

  },
);