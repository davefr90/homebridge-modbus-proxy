import type { RegisterDefinition } from './RegisterDefinition.js';
import type { RegisterGroup } from './RegisterGroup.js';

/**
 * Builds contiguous Modbus register groups.
 */
export class RegisterGroupBuilder {

  /**
   * Groups compatible, adjacent register definitions.
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

          return left.address - right.address;

        },
      );

    const groups: RegisterGroup[] =
      [];

    for (const register of sortedRegisters) {

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
        this.createGroup(register),
      );

    }

    return groups;

  }

  /**
   * Returns whether a register can be appended
   * to the supplied group.
   */
  private canAppend(
  group: RegisterGroup,
  register: RegisterDefinition,
): boolean {

  const groupEndAddress =
    group.startAddress +
    group.length;

  const groupInterval =
    group.registers[0]?.pollIntervalMs;

  return (
    group.unitId === register.unitId &&
    group.function === register.function &&
    groupInterval === register.pollIntervalMs &&
    register.address <= groupEndAddress
  );

}

  /**
   * Creates a new group from one register.
   */
  private createGroup(
    register: RegisterDefinition,
  ): RegisterGroup {

    return {
      unitId: register.unitId,
      function: register.function,
      startAddress: register.address,
      length: register.length,
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

    const currentEndAddress =
      group.startAddress +
      group.length;

    const registerEndAddress =
      register.address +
      register.length;

    return {
      ...group,
      length:
        Math.max(
          currentEndAddress,
          registerEndAddress,
        ) -
        group.startAddress,
      registers: [
        ...group.registers,
        register,
      ],
    };

  }

}