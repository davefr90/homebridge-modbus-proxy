/**
 * In-memory storage for Modbus discrete inputs.
 *
 * Missing inputs default to false.
 */
export class DiscreteInputBank {
  private readonly inputs =
    new Map<number, boolean>();

  /**
   * Reads a single discrete input.
   *
   * Missing inputs default to false.
   */
  public readInput(
    address: number,
  ): boolean {
    return (
      this.inputs.get(address) ??
      false
    );
  }

  /**
   * Writes a single discrete input.
   */
  public writeInput(
    address: number,
    value: boolean,
  ): void {
    this.inputs.set(
      address,
      value,
    );
  }

  /**
   * Removes all stored discrete inputs.
   */
  public clear(): void {
    this.inputs.clear();
  }
}