/**
 * In-memory storage for Modbus coils.
 *
 * Missing coils default to false.
 */
export class CoilBank {
  private readonly coils =
    new Map<number, boolean>();

  /**
   * Reads a single coil.
   *
   * Missing coils default to false.
   */
  public readCoil(
    address: number,
  ): boolean {
    return (
      this.coils.get(address) ??
      false
    );
  }

  /**
   * Writes a single coil.
   */
  public writeCoil(
    address: number,
    value: boolean,
  ): void {
    this.coils.set(
      address,
      value,
    );
  }
  /**
   * Writes multiple consecutive coils.
   */
  public writeCoils(
    address: number,
    values: boolean[],
  ): void {
    values.forEach(
      (
        value,
        index,
      ) => {
        this.writeCoil(
          address + index,
          value,
        );
      },
    );
  }
  /**
   * Removes all stored coils.
   */
  public clear(): void {
    this.coils.clear();
  }
}