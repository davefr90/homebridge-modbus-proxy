/**
 * Generic logging interface used throughout the project.
 *
 * Implementations may forward log messages to Homebridge,
 * the console or any other logging backend.
 */
export interface Logger {
  /**
   * Writes a debug message.
   */
  debug(
    message: string,
  ): void;

  /**
   * Writes an informational message.
   */
  info(
    message: string,
  ): void;

  /**
   * Writes a warning message.
   */
  warn(
    message: string,
  ): void;

  /**
   * Writes an error message.
   */
  error(
    message: string,
    error?: Error,
  ): void;
}