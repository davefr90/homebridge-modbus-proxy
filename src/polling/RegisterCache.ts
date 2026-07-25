/**
 * Stores the latest Modbus register values.
 */
export class RegisterCache {
  private readonly registers =
    new Map<string, Uint16Array>();

  /**
   * Stores register values.
   *
   * @returns true if the value changed.
   */
  public store(
    unitId: number,
    startAddress: number,
    values: Uint16Array,
  ): boolean {

    const key =
      this.createKey(
        unitId,
        startAddress,
      );

    const previous =
      this.registers.get(key);

    this.registers.set(
      key,
      values,
    );

    if (previous === undefined) {
      return true;
    }

    if (previous.length !== values.length) {
      return true;
    }

    for (let i = 0; i < values.length; i++) {
      if (previous[i] !== values[i]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Reads cached register values.
   */
  public read(
    unitId: number,
    startAddress: number,
    quantity: number,
  ): Uint16Array | undefined {

    const values =
      this.registers.get(
        this.createKey(
          unitId,
          startAddress,
        ),
      );

    if (values === undefined) {
      return undefined;
    }

    if (values.length !== quantity) {
      return undefined;
    }

    return values;
  }

  /**
   * Creates a cache key.
   */
  private createKey(
    unitId: number,
    startAddress: number,
  ): string {
    return `${unitId}:${startAddress}`;
  }
}