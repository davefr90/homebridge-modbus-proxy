import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  SunSpecDiscovery,
} from '../../src/sunspec/discovery/SunSpecDiscovery.js';

import type {
  SunSpecDiscoveryClient,
} from '../../src/sunspec/discovery/SunSpecDiscovery.js';

/**
 * Creates a mock discovery client.
 */
function createClient(
  responses:
    ReadonlyMap<number, readonly number[]>,
): SunSpecDiscoveryClient {

  return {

    readHoldingRegisters:
      vi.fn(
        async (
          _unitId: number,
          address: number,
          quantity: number,
        ): Promise<number[]> => {

          const response =
            responses.get(
              address,
            );

          if (
            response === undefined
          ) {
            throw new Error(
              `No mock response for address ${address}.`,
            );
          }

          return response.slice(
            0,
            quantity,
          );

        },
      ),

  };

}

describe(
  'SunSpecDiscovery',
  () => {

    it(
      'discovers one SunSpec model',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                  66,
                ],
              ],
              [
                40070,
                [
                  0xffff,
                  0,
                ],
              ],
            ]),
          );

        const discovery =
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          );

        const result =
          await discovery.discover(
            1,
          );

        expect(
          result.unitId,
        ).toBe(
          1,
        );

        expect(
          result.baseAddress,
        ).toBe(
          40000,
        );

        expect(
          result.size(),
        ).toBe(
          1,
        );

        expect(
          result.models(),
        ).toEqual([
          {
            id: 1,
            headerAddress: 40002,
            dataAddress: 40004,
            length: 66,
          },
        ]);

      },
    );

    it(
      'discovers multiple SunSpec models',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                  66,
                ],
              ],
              [
                40070,
                [
                  103,
                  50,
                ],
              ],
              [
                40122,
                [
                  120,
                  26,
                ],
              ],
              [
                40150,
                [
                  0xffff,
                  0,
                ],
              ],
            ]),
          );

        const discovery =
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          );

        const result =
          await discovery.discover();

        expect(
          result.models(),
        ).toEqual([
          {
            id: 1,
            headerAddress: 40002,
            dataAddress: 40004,
            length: 66,
          },
          {
            id: 103,
            headerAddress: 40070,
            dataAddress: 40072,
            length: 50,
          },
          {
            id: 120,
            headerAddress: 40122,
            dataAddress: 40124,
            length: 26,
          },
        ]);

        expect(
          result.hasModel(
            103,
          ),
        ).toBe(
          true,
        );

        expect(
          result.model(
            120,
          ).dataAddress,
        ).toBe(
          40124,
        );

      },
    );

    it(
      'supports repeating model IDs',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  160,
                  10,
                ],
              ],
              [
                40014,
                [
                  160,
                  10,
                ],
              ],
              [
                40026,
                [
                  0xffff,
                  0,
                ],
              ],
            ]),
          );

        const result =
          await new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          ).discover();

        expect(
          result.modelsById(
            160,
          ),
        ).toHaveLength(
          2,
        );

      },
    );

    it(
      'searches multiple configured base addresses',
      async () => {

        const client: SunSpecDiscoveryClient =
          {

            readHoldingRegisters:
              vi.fn(
                async (
                  _unitId: number,
                  address: number,
                  _quantity: number,
                ): Promise<number[]> => {

                  if (
                    address === 0
                  ) {
                    return [
                      0,
                      0,
                      0,
                      0,
                    ];
                  }

                  if (
                    address === 40000
                  ) {
                    return [
                      0x5375,
                      0x6e53,
                      1,
                      2,
                    ];
                  }

                  if (
                    address === 40006
                  ) {
                    return [
                      0xffff,
                      0,
                    ];
                  }

                  throw new Error(
                    `Unexpected address: ${address}`,
                  );

                },
              ),

          };

        const result =
          await new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                0,
                40000,
              ],
            },
          ).discover();

        expect(
          result.baseAddress,
        ).toBe(
          40000,
        );

      },
    );

    it(
      'rejects an invalid SunSpec identifier',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0,
                  0,
                  1,
                  66,
                ],
              ],
            ]),
          );

        const discovery =
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          );

        await expect(
          discovery.discoverAt(
            1,
            40000,
          ),
        ).rejects.toThrow(
          'Invalid SunSpec identifier',
        );

      },
    );

    it(
      'rejects a truncated initial response',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                ],
              ],
            ]),
          );

        await expect(
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          ).discoverAt(
            1,
            40000,
          ),
        ).rejects.toThrow(
          'expected 4 registers, received 3',
        );

      },
    );

    it(
      'rejects a truncated model header response',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                  2,
                ],
              ],
              [
                40006,
                [
                  0xffff,
                ],
              ],
            ]),
          );

        await expect(
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          ).discoverAt(
            1,
            40000,
          ),
        ).rejects.toThrow(
          'expected 2 registers, received 1',
        );

      },
    );

    it(
      'rejects a zero-length model',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  103,
                  0,
                ],
              ],
            ]),
          );

        await expect(
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          ).discoverAt(
            1,
            40000,
          ),
        ).rejects.toThrow(
          'Invalid SunSpec model length 0',
        );

      },
    );

    it(
      'stops when the configured model limit is reached',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                  1,
                ],
              ],
              [
                40005,
                [
                  103,
                  1,
                ],
              ],
            ]),
          );

        const discovery =
          new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
              maxModels: 1,
            },
          );

        await expect(
          discovery.discoverAt(
            1,
            40000,
          ),
        ).rejects.toThrow(
          'SunSpec discovery exceeded the maximum of 1 models.',
        );

      },
    );

    it(
      'rejects an invalid Modbus unit ID',
      async () => {

        const client =
          createClient(
            new Map(),
          );

        const discovery =
          new SunSpecDiscovery(
            client,
          );

        await expect(
          discovery.discover(
            0,
          ),
        ).rejects.toThrow(
          'Invalid Modbus unit ID: 0',
        );

      },
    );

    it(
      'rejects an empty base-address list',
      () => {

        const client =
          createClient(
            new Map(),
          );

        expect(
          () =>
            new SunSpecDiscovery(
              client,
              {
                baseAddresses: [],
              },
            ),
        ).toThrow(
          'At least one SunSpec base address is required.',
        );

      },
    );

    it(
      'throws when a requested model does not exist',
      async () => {

        const client =
          createClient(
            new Map([
              [
                40000,
                [
                  0x5375,
                  0x6e53,
                  1,
                  2,
                ],
              ],
              [
                40006,
                [
                  0xffff,
                  0,
                ],
              ],
            ]),
          );

        const result =
          await new SunSpecDiscovery(
            client,
            {
              baseAddresses: [
                40000,
              ],
            },
          ).discover();

        expect(
          () =>
            result.model(
              103,
            ),
        ).toThrow(
          'SunSpec model not found: 103',
        );

      },
    );

  },
);