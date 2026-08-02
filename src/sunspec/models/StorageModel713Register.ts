/**
 * Register offsets for SunSpec Model 713:
 * DER Storage Capacity.
 *
 * Offsets are relative to the first data register after
 * the model ID and model-length registers.
 *
 * Model length: 7 registers.
 */
export enum StorageModel713Register {
  ENERGY_RATING = 0,
  ENERGY_AVAILABLE = 1,
  STATE_OF_CHARGE = 2,
  STATE_OF_HEALTH = 3,
  STATUS = 4,
  ENERGY_SCALE_FACTOR = 5,
  PERCENTAGE_SCALE_FACTOR = 6,
}
