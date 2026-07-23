/**
 * Simple in-memory Modbus register storage used by the integration tests.
 *
 * The register bank contains two independent Modbus register areas:
 *
 * - Holding Registers
 * - Input Registers
 *
 * Both register areas contain the complete 16-bit Modbus address space
 * from address 0 to address 65535.
 */
export class RegisterBank {
  /**
   * Storage for Holding Registers.
   *
   * Uint16Array is suitable because every Modbus register contains
   * one unsigned 16-bit value between 0 and 65535.
   *
   * Newly created entries automatically contain zero.
   */
  private readonly holdingRegisters =
    new Uint16Array(65536);

  /**
   * Storage for Input Registers.
   *
   * Input Registers are stored separately from Holding Registers.
   * The same numerical address can therefore contain different values
   * in the two register areas.
   */
  private readonly inputRegisters =
    new Uint16Array(65536);

  /**
   * Reads one or more consecutive Holding Registers.
   *
   * @param address Starting register address
   * @param quantity Number of registers to read
   *
   * @returns Array containing the requested register values
   */
  public readHoldingRegisters(
    address: number,
    quantity: number,
  ): number[] {
    this.validateRange(
      address,
      quantity,
    );

    return Array.from(
      this.holdingRegisters.slice(
        address,
        address + quantity,
      ),
    );
  }

  /**
   * Writes one or more consecutive Holding Registers.
   *
   * @param address Starting register address
   * @param values Register values to write
   */
  public writeHoldingRegisters(
    address: number,
    values: number[],
  ): void {
    this.validateRange(
      address,
      values.length,
    );

    values.forEach(
      (value, index) => {
        this.validateValue(value);

        this.holdingRegisters[
          address + index
        ] = value;
      },
    );
  }

  /**
   * Reads one or more consecutive Input Registers.
   *
   * @param address Starting register address
   * @param quantity Number of registers to read
   *
   * @returns Array containing the requested register values
   */
  public readInputRegisters(
    address: number,
    quantity: number,
  ): number[] {
    this.validateRange(
      address,
      quantity,
    );

    return Array.from(
      this.inputRegisters.slice(
        address,
        address + quantity,
      ),
    );
  }

  /**
   * Writes one or more consecutive Input Registers.
   *
   * Input Registers are normally read-only from the perspective
   * of a Modbus client.
   *
   * This method still exists because integration tests need a way
   * to prepare simulated device values before the client reads them.
   *
   * @param address Starting register address
   * @param values Register values to write
   */
  public writeInputRegisters(
    address: number,
    values: number[],
  ): void {
    this.validateRange(
      address,
      values.length,
    );

    values.forEach(
      (value, index) => {
        this.validateValue(value);

        this.inputRegisters[
          address + index
        ] = value;
      },
    );
  }

  /**
   * Writes one Holding Register.
   *
   * This is a convenience method for tests that only need
   * to prepare one register value.
   */
  public writeHoldingRegister(
    address: number,
    value: number,
  ): void {
    this.writeHoldingRegisters(
      address,
      [value],
    );
  }

  /**
   * Reads one Holding Register.
   *
   * This is a convenience method used by the fake Modbus server
   * when constructing a response register by register.
   */
  public readHoldingRegister(
    address: number,
  ): number {
    return this.readHoldingRegisters(
      address,
      1,
    )[0];
  }

  /**
   * Writes one Input Register.
   *
   * Input Registers cannot normally be written through the
   * Modbus protocol by a client.
   *
   * This helper is only used to configure the simulated device
   * state inside integration tests.
   */
  public writeInputRegister(
    address: number,
    value: number,
  ): void {
    this.writeInputRegisters(
      address,
      [value],
    );
  }

  /**
   * Reads one Input Register.
   *
   * This helper will be used by the fake Modbus server while
   * handling Function Code 0x04.
   */
  public readInputRegister(
    address: number,
  ): number {
    return this.readInputRegisters(
      address,
      1,
    )[0];
  }

  /**
   * Clears all Holding Registers and Input Registers.
   *
   * Uint16Array.fill(0) resets the complete address space.
   * This ensures that every integration test starts with a
   * clean and predictable register state.
   */
  public clear(): void {
    this.holdingRegisters.fill(0);
    this.inputRegisters.fill(0);
  }

  /**
   * Validates a consecutive Modbus register range.
   *
   * Valid addresses range from:
   *
   * 0 to 65535
   *
   * The quantity must contain at least one register and the
   * complete range must remain inside the 16-bit address space.
   */
  private validateRange(
    address: number,
    quantity: number,
  ): void {
    if (
      !Number.isInteger(address) ||
      address < 0 ||
      address > 0xffff
    ) {
      throw new RangeError(
        'Invalid register address.',
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new RangeError(
        'Invalid register quantity.',
      );
    }

    if (
      address + quantity >
      0x10000
    ) {
      throw new RangeError(
        'Register range exceeds address space.',
      );
    }
  }

  /**
   * Validates one unsigned 16-bit Modbus register value.
   *
   * A valid register value must be an integer between:
   *
   * 0 and 65535
   */
  private validateValue(
    value: number,
  ): void {
    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 0xffff
    ) {
      throw new RangeError(
        'Register value must be between 0 and 65535.',
      );
    }
  }
}