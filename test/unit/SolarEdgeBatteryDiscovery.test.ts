import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type {
  ModbusClient,
} from '../../src/client/ModbusClient.js';

import {
  ModbusException,
} from '../../src/exceptions/ModbusException.js';

import {
  ModbusExceptionCode,
} from '../../src/protocol/ModbusExceptionCode.js';

import {
  SolarEdgeBatteryDiscovery,
} from '../../src/sunspec/solaredge/SolarEdgeBatteryDiscovery.js';

import {
  SolarEdgeBatteryModel,
} from '../../src/sunspec/solaredge/SolarEdgeBatteryModel.js';

/**
 * Encodes an ASCII value into a fixed String[32] register block.
 */
function encodeString(
  value: string,
): number[] {

  const registers =
    new Array<number>(16)
      .fill(0);

  for (
    let index = 0;
    index < value.length;
    index += 2
  ) {

    const highByte =
      value.charCodeAt(
        index,
      );

    const lowByte =
      index + 1 < value.length
        ? value.charCodeAt(
          index + 1,
        )
        : 0;

    registers[index / 2] =
      (highByte << 8)
      | lowByte;

  }

  return registers;

}

describe(
  'SolarEdgeBatteryDiscovery',
  () => {

    it(
      'detects the primary Battery 1 block',
      async () => {

        const readHoldingRegisters =
          vi.fn()
            .mockResolvedValue(
              encodeString(
                '48V_BYD',
              ),
            );

        const result =
          await SolarEdgeBatteryDiscovery
            .discover(
              {
                readHoldingRegisters,
              } as unknown as ModbusClient,
              2,
            );

        expect(
          result,
        ).toEqual({
          baseAddress:
            SolarEdgeBatteryModel.PRIMARY_BASE_ADDRESS,
          manufacturer:
            '48V_BYD',
        });

        expect(
          readHoldingRegisters,
        ).toHaveBeenCalledWith(
          2,
          SolarEdgeBatteryModel.PRIMARY_BASE_ADDRESS,
          16,
        );

      },
    );

    it(
      'uses the alternate block when the primary block is unavailable',
      async () => {

        const readHoldingRegisters =
          vi.fn()
            .mockRejectedValueOnce(
              new ModbusException(
                3,
                ModbusExceptionCode.IllegalDataAddress,
              ),
            )
            .mockResolvedValueOnce(
              encodeString(
                '48V_BYD',
              ),
            );

        await expect(
          SolarEdgeBatteryDiscovery
            .discover(
              {
                readHoldingRegisters,
              } as unknown as ModbusClient,
              3,
            ),
        ).resolves.toEqual({
          baseAddress:
            SolarEdgeBatteryModel.ALTERNATE_BASE_ADDRESS,
          manufacturer:
            '48V_BYD',
        });

        expect(
          readHoldingRegisters,
        ).toHaveBeenCalledTimes(
          2,
        );

      },
    );

    it(
      'returns undefined when neither block contains a battery',
      async () => {

        const readHoldingRegisters =
          vi.fn()
            .mockResolvedValueOnce(
              new Array<number>(16)
                .fill(0),
            )
            .mockResolvedValueOnce(
              new Array<number>(16)
                .fill(0xFFFF),
            );

        await expect(
          SolarEdgeBatteryDiscovery
            .discover(
              {
                readHoldingRegisters,
              } as unknown as ModbusClient,
              1,
            ),
        ).resolves.toBeUndefined();

      },
    );

    it(
      'does not hide connection errors',
      async () => {

        const error =
          new Error(
            'Connection closed.',
          );

        await expect(
          SolarEdgeBatteryDiscovery
            .discover(
              {
                readHoldingRegisters:
                  vi.fn()
                    .mockRejectedValue(
                      error,
                    ),
              } as unknown as ModbusClient,
              2,
            ),
        ).rejects.toBe(
          error,
        );

      },
    );

  },
);
