import type {
  ModbusPollingClient,
} from './ModbusPollingClient.js';

import {
  PollFunction,
} from './PollFunction.js';

import type {
  PollResult,
} from './PollResult.js';

import type {
  PollingTask,
} from './PollingTask.js';

/**
 * Polls one contiguous block of Modbus values.
 */
export class RegisterPollingTask
implements PollingTask<PollResult> {

  public constructor(
    private readonly client:
      ModbusPollingClient,
    private readonly functionCode:
      PollFunction,
    private readonly unitId:
      number,
    private readonly startAddress:
      number,
    private readonly quantity:
      number,
  ) {}

  /**
   * Executes one polling cycle and returns the result.
   */
  public async execute():
    Promise<PollResult> {
    const startedAt =
      new Date();

    const startedAtMs =
      performance.now();

    const values =
      await this.readValues();

    const completedAt =
      new Date();

    const durationMs =
      performance.now() -
      startedAtMs;

    return {
      unitId:
        this.unitId,

      functionCode:
        this.functionCode,

      startAddress:
        this.startAddress,

      quantity:
        this.quantity,

      values,

      startedAt,

      completedAt,

      durationMs,
    };
  }

  /**
   * Executes the configured Modbus read operation.
   */
  private async readValues():
    Promise<Uint16Array> {
    switch (this.functionCode) {
    case PollFunction.ReadHoldingRegisters:
      return this.client.readHoldingRegisters(
        this.unitId,
        this.startAddress,
        this.quantity,
      );

    case PollFunction.ReadInputRegisters:
      return this.client.readInputRegisters(
        this.unitId,
        this.startAddress,
        this.quantity,
      );

    case PollFunction.ReadCoils: {
      const values =
          await this.client.readCoils(
            this.unitId,
            this.startAddress,
            this.quantity,
          );

      return Uint16Array.from(
        values,
        (value) =>
          value ? 1 : 0,
      );
    }

    case PollFunction.ReadDiscreteInputs: {
      const values =
          await this.client.readDiscreteInputs(
            this.unitId,
            this.startAddress,
            this.quantity,
          );

      return Uint16Array.from(
        values,
        (value) =>
          value ? 1 : 0,
      );
    }

    default:
      throw new RangeError(
        `Unsupported polling function code: ${this.functionCode}`,
      );
    }
  }
}