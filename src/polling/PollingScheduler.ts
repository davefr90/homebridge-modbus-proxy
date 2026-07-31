import { DevicePoller } from './DevicePoller.js';

import type {
  SchedulerTask,
} from './SchedulerTask.js';

/**
 * Manages and executes polling tasks.
 */
export class PollingScheduler {
  private readonly tasks =
    new Map<string, SchedulerTask>();

  private readonly pollers =
    new Map<string, DevicePoller>();

  private running =
    false;

  /**
   * Adds a task.
   */
  public addTask(
    task: SchedulerTask,
  ): void {
    if (this.tasks.has(task.id)) {
      throw new Error(
        `Polling task already exists: ${task.id}`,
      );
    }

    this.tasks.set(
      task.id,
      task,
    );

    if (this.running) {
      this.startTask(task);
    }
  }

  /**
   * Removes a task.
   */
  public removeTask(
    id: string,
  ): boolean {
    const poller =
      this.pollers.get(id);

    if (poller !== undefined) {
      poller.stop();
      this.pollers.delete(id);
    }

    return this.tasks.delete(id);
  }

  /**
   * Starts all registered polling tasks.
   */
  public start(): void {
    if (this.running) {
      return;
    }

    this.running =
      true;

    for (
      const task
      of this.tasks.values()
    ) {
      this.startTask(task);
    }
  }

  /**
   * Stops all active polling tasks.
   */
  public stop(): void {
    if (!this.running) {
      return;
    }

    this.running =
      false;

    for (
      const poller
      of this.pollers.values()
    ) {
      poller.stop();
    }

    this.pollers.clear();
  }

  /**
   * Returns true when the scheduler is running.
   */
  public isRunning(): boolean {
    return this.running;
  }

  /**
   * Returns the number of registered tasks.
   */
  public getTaskCount(): number {
    return this.tasks.size;
  }

  /**
   * Returns true if a task exists.
   */
  public hasTask(
    id: string,
  ): boolean {
    return this.tasks.has(id);
  }

  /**
   * Creates and starts a poller for one task.
   */
  private startTask(
    task: SchedulerTask,
  ): void {
    const existingPoller =
      this.pollers.get(task.id);

    if (existingPoller !== undefined) {
      return;
    }

    const poller =
    new DevicePoller(
      task.task,
      task.intervalMs,
    );

    this.pollers.set(
      task.id,
      poller,
    );

    poller.start();
  }
}