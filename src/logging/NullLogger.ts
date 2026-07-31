import { Logger } from './Logger.js';

/**
 * Logger implementation that discards all messages.
 *
 * Used as the default logger until another logger
 * is injected.
 */
export class NullLogger
implements Logger {
  public debug(
    _message: string,
  ): void {}

  public info(
    _message: string,
  ): void {}

  public warn(
    _message: string,
  ): void {}

  public error(
    _message: string,
    _error?: Error,
  ): void {}
}