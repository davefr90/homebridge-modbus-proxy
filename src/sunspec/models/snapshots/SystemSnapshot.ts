import type {
  CommonSnapshot,
} from './CommonSnapshot.js';

import type {
  InverterSnapshot,
} from './InverterSnapshot.js';

import type {
  MeterSnapshot,
} from './MeterSnapshot.js';

import type {
  NameplateSnapshot,
} from './NameplateSnapshot.js';

import type {
  StorageSnapshot,
} from './StorageSnapshot.js';

/**
 * Immutable snapshot of all currently exposed
 * SunSpec device areas.
 */
export interface SystemSnapshot {

  readonly common:
    CommonSnapshot;

  readonly inverter:
    InverterSnapshot;

  /**
   * Nameplate data is optional because SolarEdge Unit 2
   * does not expose SunSpec Model 120.
   */
  readonly nameplate?:
    NameplateSnapshot;

  /**
   * Meter data is present when SunSpec Model 203 was
   * discovered.
   */
  readonly meter?:
    MeterSnapshot;

  /**
   * Storage data is present when SunSpec Model 713 was
   * discovered.
   */
  readonly storage?:
    StorageSnapshot;

}
