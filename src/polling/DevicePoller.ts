import type {
  PollingTask,
} from './PollingTask.js';

/**
 * Executes a polling task periodically.
 *
 * Overlapping executions are prevented. If a polling cycle is still running
 * when the next interval is reached, that interval is skipped.
 */
export class DevicePoller<TResult = unknown> {
  private timer:
    ReturnType<typeof setInterval> |
    undefined;

  private running =
    false;

  private polling =
    false;

  public constructor(
    private readonly task:
      PollingTask<TResult>,
    private readonly intervalMs =
    1000,
  ) {
    if (
      !Number.isFinite(intervalMs) ||
      intervalMs <= 0
    ) {
      throw new RangeError(
        'Polling interval must be greater than zero.',
      );
    }
  }

  /**
   * Starts periodic polling.
   */
  public start(): void {
    if (this.running) {
      return;
    }

    this.running =
      true;

    this.timer =
      setInterval(
        () => {
          void this.executeTask();
        },
        this.intervalMs,
      );
  }

  /**
   * Stops periodic polling.
   */
  public stop(): void {
    if (!this.running) {
      return;
    }

    this.running =
      false;

    if (this.timer !== undefined) {
      clearInterval(this.timer);

      this.timer =
        undefined;
    }
  }

  /**
   * Returns whether the poller is running.
   */
  public isRunning(): boolean {
    return this.running;
  }

  /**
   * Executes the configured task unless another execution is still active.
   */
  private async executeTask():
    Promise<void> {
    if (
      !this.running ||
      this.polling
    ) {
      return;
    }

    this.polling =
      true;

    try {
      await this.task.execute();
    } finally {
      this.polling =
        false;
    }
  }
}