import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';

/**
 * Represents a request waiting for its corresponding response.
 */
export class PendingRequest {
  public constructor(
    public readonly transactionId: number,
    public readonly resolve: (
      frame: ModbusTcpFrame,
    ) => void,
    public readonly reject: (
      reason?: unknown,
    ) => void,
    public readonly resolveExceptionResponses = false,
    public readonly createdAt = Date.now(),
  ) {}
}