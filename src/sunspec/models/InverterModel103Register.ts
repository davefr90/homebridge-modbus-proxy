/**
 * Register offsets within the data section of
 * SunSpec three-phase inverter model 103.
 *
 * The offsets are relative to the first data register,
 * immediately after model ID and model length.
 */
export enum InverterModel103Register {

  /**
   * Total AC current.
   */
  AC_CURRENT = 0,

  /**
   * Phase A AC current.
   */
  AC_CURRENT_PHASE_A = 1,

  /**
   * Phase B AC current.
   */
  AC_CURRENT_PHASE_B = 2,

  /**
   * Phase C AC current.
   */
  AC_CURRENT_PHASE_C = 3,

  /**
   * Base-10 scale factor for all AC current values.
   */
  AC_CURRENT_SCALE_FACTOR = 4,

}