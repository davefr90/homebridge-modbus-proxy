import type { RegisterGroup } from '../model/RegisterGroup.js';

/**
 * Describes one polling plan entry.
 */
export interface PollPlanEntry {

  /**
   * Register group to poll.
   */
  readonly group: RegisterGroup;

  /**
   * Poll interval in milliseconds.
   */
  readonly intervalMs: number;

}