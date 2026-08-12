import { Socket } from 'node:net';

import { ModbusTcpEncoder } from '../protocol/ModbusTcpEncoder.js';
import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ModbusTcpFrameParser } from '../protocol/ModbusTcpFrameParser.js';
import { ConnectionManager } from './ConnectionManager.js';

/**
 * Represents one TCP client connected to the proxy server.
 */
export class ProxySession {
  private readonly frameParser =
    new ModbusTcpFrameParser();

  private processingQueue =
    Promise.resolve();

  private closed = false;

  public constructor(
    private readonly socket: Socket,
    private readonly connectionManager: ConnectionManager,
    private readonly closeCallback: (
      session: ProxySession,
    ) => void,
  ) {
    this.socket.on(
      'data',
      this.handleData,
    );

    this.socket.once(
      'close',
      this.handleClose,
    );

    this.socket.on(
      'error',
      this.handleSocketError,
    );
  }

  /**
   * Returns whether the client socket is still connected.
   */
  public get isConnected(): boolean {
    return (
      !this.closed &&
      !this.socket.destroyed
    );
  }

  /**
   * Returns the remote IP address of the connected client.
   */
  public get remoteAddress():
    | string
    | undefined {
    return this.socket.remoteAddress;
  }

  /**
   * Returns the remote TCP port of the connected client.
   */
  public get remotePort():
    | number
    | undefined {
    return this.socket.remotePort;
  }

  /**
   * Closes the client connection.
   */
  public disconnect(): void {
    if (this.closed) {
      return;
    }

    this.socket.destroy();
  }

  /**
   * Parses incoming TCP data and queues complete frames
   * for serial processing.
   */
  private readonly handleData = (
    data: Buffer,
  ): void => {
    if (this.closed) {
      return;
    }

    try {
      const frames =
        this.frameParser.push(
          Buffer.from(data),
        );

      for (const frame of frames) {
        this.enqueueFrame(frame);
      }
    } catch {
      /*
       * A malformed Modbus TCP stream cannot be safely
       * continued because frame boundaries are unknown.
       */
      this.disconnect();
    }
  };

  /**
   * Adds a frame to this session's serial processing queue.
   */
  private enqueueFrame(
    frame: ModbusTcpFrame,
  ): void {
    this.processingQueue =
      this.processingQueue
        .then(async () => {
          await this.forwardFrame(frame);
        })
        .catch(() => {
          /*
           * A failed target request makes the current client
           * session unusable. Closing the socket also prevents
           * later queued requests from being forwarded.
           */
          this.disconnect();
        });
  }

  /**
   * Forwards one frame to the target Modbus server and
   * writes the response back to the connected proxy client.
   */
  private async forwardFrame(
    frame: ModbusTcpFrame,
  ): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    if (!this.connectionManager.isConnected()) {
      throw new Error(
        'Target Modbus connection is not available.',
      );
    }

    const response =
      await this.connectionManager
        .executeFrame(frame);

    if (!this.isConnected) {
      return;
    }

    const buffer =
      ModbusTcpEncoder.encode(
        response,
      );

    await this.write(buffer);
  }

  /**
 * Writes data to the client socket.
 */
  private write(
    buffer: Buffer,
  ): Promise<void> {
    return new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        if (!this.isConnected) {
          reject(
            new Error(
              'Proxy client socket is not connected.',
            ),
          );

          return;
        }

        this.socket.write(
          buffer,
          (error) => {
            if (error != null) {
              reject(error);
              return;
            }

            resolve();
          },
        );
      },
    );
  }

  /**
   * Handles errors emitted by the client socket.
   *
   * The socket's close event performs the final cleanup.
   */
  private readonly handleSocketError = (): void => {
    this.disconnect();
  };

  /**
   * Handles a closed client socket.
   */
  private readonly handleClose = (): void => {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.frameParser.reset();

    this.socket.removeListener(
      'data',
      this.handleData,
    );

    this.socket.removeListener(
      'close',
      this.handleClose,
    );

    this.socket.removeListener(
      'error',
      this.handleSocketError,
    );

    this.closeCallback(this);
  };
}
