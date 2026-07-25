/**
 * Represents a unit of work executed by a DevicePoller.
 */
export interface PollingTask<TResult = void> {
  /**
   * Executes one polling cycle.
   */
  execute(): Promise<TResult>;
}