import { RegisterCache } from './RegisterCache.js';

export interface RegisterCacheChange {
  unitId: number;
  startAddress: number;
  values: Uint16Array;
}

export type RegisterCacheChangeListener =
  (
    change: RegisterCacheChange,
  ) => void;

/**
 * Coordinates updates to the register cache.
 */
export class RegisterCacheManager {
  private readonly listeners =
    new Set<RegisterCacheChangeListener>();

  public constructor(
    private readonly cache:
      RegisterCache,
  ) {}

  /**
   * Stores new register values.
   *
   * Listeners are notified only when the values changed.
   *
   * @returns true if the values changed.
   */
  public store(
    unitId: number,
    startAddress: number,
    values: Uint16Array,
  ): boolean {
    const changed =
      this.cache.store(
        unitId,
        startAddress,
        values,
      );

    if (!changed) {
      return false;
    }

    this.notify({
      unitId,
      startAddress,
      values,
    });

    return true;
  }

  /**
   * Registers a listener for changed register values.
   */
  public onChanged(
    listener: RegisterCacheChangeListener,
  ): void {
    this.listeners.add(
      listener,
    );
  }

  /**
   * Removes a previously registered listener.
   */
  public offChanged(
    listener: RegisterCacheChangeListener,
  ): void {
    this.listeners.delete(
      listener,
    );
  }

  /**
   * Notifies all registered listeners.
   */
  private notify(
    change: RegisterCacheChange,
  ): void {
    for (
      const listener
      of this.listeners
    ) {
      listener(change);
    }
  }
}