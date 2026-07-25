import type { PollingTask } from './PollingTask.js';

/**
 * Represents one scheduled polling task.
 */
export interface SchedulerTask<TResult = unknown> {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Polling interval in milliseconds.
   */
  intervalMs: number;

  /**
   * Task to execute.
   */
  task: PollingTask<TResult>;
}