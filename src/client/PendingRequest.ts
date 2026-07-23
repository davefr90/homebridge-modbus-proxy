import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';

/**
 * Represents a request waiting for its corresponding response.
 */
export class PendingRequest {
  constructor(
    public readonly transactionId: number,
    public readonly resolve: (frame: ModbusTcpFrame) => void,
    public readonly reject: (reason?: unknown) => void,
    public readonly createdAt = Date.now(),
  ) {}
}