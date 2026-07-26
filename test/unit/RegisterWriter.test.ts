import {
  describe,
  expect,
  it,
} from 'vitest';

import { RegisterWriter } from '../../src/model/RegisterWriter.js';

describe(
  'RegisterWriter',
  () => {

    it(
      'can be instantiated',
      () => {

        const client = {} as never;

        expect(
          new RegisterWriter(client),
        ).toBeInstanceOf(RegisterWriter);

      },
    );

  },
);