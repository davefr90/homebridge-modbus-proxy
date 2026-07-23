import {
  LENGTH_OFFSET,
  MAX_FRAME_SIZE,
  PREFIX_SIZE,
} from './ModbusTcpConstants.js';
import { ModbusTcpDecoder } from './ModbusTcpDecoder.js';
import { ModbusTcpFrame } from './ModbusTcpFrame.js';

export class ModbusTcpFrameParser {
  private buffer = Buffer.alloc(0);

  public push(chunk: Buffer): ModbusTcpFrame[] {
    if (chunk.length === 0) {
      return [];
    }

    this.buffer = Buffer.concat([this.buffer, chunk]);

    const frames: ModbusTcpFrame[] = [];

    while (true) {
      const frameLength = this.getFrameLength();

      if (frameLength === null) {
        break;
      }

      if (this.buffer.length < frameLength) {
        break;
      }

      const frameBuffer = this.buffer.subarray(0, frameLength);

      frames.push(ModbusTcpDecoder.decode(frameBuffer));

      this.buffer = this.buffer.subarray(frameLength);
    }

    return frames;
  }

  public reset(): void {
    this.buffer = Buffer.alloc(0);
  }

  public get bufferedBytes(): number {
    return this.buffer.length;
  }

  private getFrameLength(): number | null {
    if (this.buffer.length < PREFIX_SIZE) {
      return null;
    }

    const length = this.buffer.readUInt16BE(LENGTH_OFFSET);

    if (length < 2) {
      throw new Error('Invalid Modbus TCP frame length.');
    }

    const frameLength = PREFIX_SIZE + length;

    if (frameLength > MAX_FRAME_SIZE) {
      throw new Error(
        'Modbus TCP frame exceeds maximum supported size.',
      );
    }

    return frameLength;
  }
}