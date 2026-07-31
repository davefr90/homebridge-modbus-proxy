import type { PollResult } from './PollResult.js';
import type { PollingTask } from './PollingTask.js';
import { RegisterCacheManager } from './RegisterCacheManager.js';

/**
 * Decorates a polling task and automatically stores
 * successful poll results in the register cache.
 */
export class CachingPollingTask
implements PollingTask<PollResult> {

  public constructor(
    private readonly task:
      PollingTask<PollResult>,
    private readonly cacheManager:
      RegisterCacheManager,
  ) {}

  public async execute():
    Promise<PollResult> {

    const result =
      await this.task.execute();

    this.cacheManager.store(
      result.unitId,
      result.startAddress,
      result.values,
    );

    return result;
  }
}