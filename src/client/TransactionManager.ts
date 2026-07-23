/**
 * Generates sequential Modbus TCP transaction identifiers.
 */
export class TransactionManager {
  private transactionId = 0;

  /**
   * Returns the next transaction identifier.
   */
  public next(): number {
    const id = this.transactionId;

    this.transactionId = (this.transactionId + 1) & 0xffff;

    return id;
  }

  /**
   * Resets the transaction identifier sequence.
   */
  public reset(): void {
    this.transactionId = 0;
  }

  /**
   * Returns the current transaction identifier without incrementing it.
   */
  public get current(): number {
    return this.transactionId;
  }
}