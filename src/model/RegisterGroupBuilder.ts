import type { RegisterDefinition } from './RegisterDefinition.js';
import type { RegisterGroup } from './RegisterGroup.js';

/**
 * Configuration for building Modbus register groups.
 */
export interface RegisterGroupBuilderOptions {

  /**
   * Maximum number of unused registers allowed between
   * two register definitions in the same group.
   *
   * Default: 0
   */
  readonly maxGap?: number;

  /**
   * Maximum number of Modbus registers that may be read
   * in one request.
   *
   * Default: 125
   */
  readonly maxRegistersPerGroup?: number;

}

/**
 * Builds contiguous or near-contiguous Modbus register groups.
 */
export class RegisterGroupBuilder {

  private readonly maxGap: number;

  private readonly maxRegistersPerGroup: number;

  /**
   * Creates a new register group builder.
   */
  public constructor(
    options: RegisterGroupBuilderOptions = {},
  ) {

    this.maxGap =
      options.maxGap ??
      0;

    this.maxRegistersPerGroup =
      options.maxRegistersPerGroup ??
      125;

    this.validateOptions();

  }

  /**
   * Builds optimized groups from register definitions.
   *
   * Registers are grouped only when they use the same:
   *
   * - Modbus unit id
   * - polling function
   * - polling interval
   *
   * The resulting group must also remain within the configured
   * maximum gap and maximum request length.
   */
  public build(
    registers: readonly RegisterDefinition[],
  ): RegisterGroup[] {

    const sortedRegisters =
      [...registers].sort(
        (left, right) => {

          if (left.unitId !== right.unitId) {
            return left.unitId - right.unitId;
          }

          if (left.function !== right.function) {
            return left.function - right.function;
          }

          const leftInterval =
            left.pollIntervalMs ??
            0;

          const rightInterval =
            right.pollIntervalMs ??
            0;

          if (leftInterval !== rightInterval) {
            return leftInterval - rightInterval;
          }

          return left.address - right.address;

        },
      );

    const groups: RegisterGroup[] =
      [];

    for (const register of sortedRegisters) {

      this.validateRegister(
        register,
      );

      const currentGroup =
        groups.at(-1);

      if (
        currentGroup !== undefined &&
        this.canAppend(
          currentGroup,
          register,
        )
      ) {

        groups[
          groups.length - 1
        ] =
          this.append(
            currentGroup,
            register,
          );

        continue;

      }

      groups.push(
        this.createGroup(
          register,
        ),
      );

    }

    return groups;

  }

  /**
   * Validates builder configuration.
   */
  private validateOptions(): void {

    if (
      !Number.isInteger(
        this.maxGap,
      ) ||
      this.maxGap < 0
    ) {
      throw new Error(
        `Invalid maximum register gap: ${this.maxGap}`,
      );
    }

    if (
      !Number.isInteger(
        this.maxRegistersPerGroup,
      ) ||
      this.maxRegistersPerGroup < 1 ||
      this.maxRegistersPerGroup > 125
    ) {
      throw new Error(
        `Invalid maximum registers per group: ${this.maxRegistersPerGroup}`,
      );
    }

  }

  /**
   * Validates a register before grouping it.
   */
  private validateRegister(
    register: RegisterDefinition,
  ): void {

    if (
      register.length >
      this.maxRegistersPerGroup
    ) {
      throw new Error(
        `Register "${register.name}" exceeds the maximum group length: ${register.length}`,
      );
    }

  }

  /**
   * Returns whether a register can be appended
   * to the supplied group.
   */
  private canAppend(
    group: RegisterGroup,
    register: RegisterDefinition,
  ): boolean {

    if (
      group.unitId !== register.unitId ||
      group.function !== register.function ||
      this.groupPollInterval(group) !==
        register.pollIntervalMs
    ) {
      return false;
    }

    const groupEndExclusive =
      group.startAddress +
      group.length;

    const gap =
      Math.max(
        0,
        register.address -
        groupEndExclusive,
      );

    if (
      gap >
      this.maxGap
    ) {
      return false;
    }

    const combinedEndExclusive =
      Math.max(
        groupEndExclusive,
        register.address +
          register.length,
      );

    const combinedLength =
      combinedEndExclusive -
      group.startAddress;

    return (
      combinedLength <=
      this.maxRegistersPerGroup
    );

  }

  /**
   * Returns the polling interval used by a group.
   */
  private groupPollInterval(
    group: RegisterGroup,
  ): number | undefined {

    return group
      .registers[0]
      ?.pollIntervalMs;

  }

  /**
   * Creates a new group from one register.
   */
  private createGroup(
    register: RegisterDefinition,
  ): RegisterGroup {

    return {

      unitId:
        register.unitId,

      function:
        register.function,

      startAddress:
        register.address,

      length:
        register.length,

      registers: [
        register,
      ],

    };

  }

  /**
   * Appends a register to an existing group.
   */
  private append(
    group: RegisterGroup,
    register: RegisterDefinition,
  ): RegisterGroup {

    const currentEndExclusive =
      group.startAddress +
      group.length;

    const registerEndExclusive =
      register.address +
      register.length;

    return {

      ...group,

      length:
        Math.max(
          currentEndExclusive,
          registerEndExclusive,
        ) -
        group.startAddress,

      registers: [
        ...group.registers,
        register,
      ],

    };

  }

}