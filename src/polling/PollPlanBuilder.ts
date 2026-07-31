import type { RegisterGroup } from '../model/RegisterGroup.js';
import type { PollPlanEntry } from './PollPlanEntry.js';

/**
 * Builds a polling plan from register groups.
 */
export class PollPlanBuilder {

  /**
   * Creates polling entries.
   */
  public build(
    groups: readonly RegisterGroup[],
    defaultIntervalMs = 1000,
  ): PollPlanEntry[] {

    return groups.map(
      (group) => ({

        group,

        intervalMs:
        group.registers[0]?.pollIntervalMs ??
        defaultIntervalMs,

      }),
    );

  }

}