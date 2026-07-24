import { Socket } from 'node:net';

import { ModbusTcpFrame } from '../protocol/ModbusTcpFrame.js';
import { ModbusTcpFrameParser } from '../protocol/ModbusTcpFrameParser.js';

/**
 * Handles a single TCP connection and converts incoming TCP data
 * into complete Modbus TCP frames.
 */
export class TcpConnection {
  private socket?: Socket;

  private readonly frameParser =
    new ModbusTcpFrameParser();

  private frameCallback?: (
    frame: ModbusTcpFrame,
  ) => void;

  private dataCallback?: (
    data: Buffer | string,
  ) => void;

  private errorCallback?: (
    error: Error,
  ) => void;

  private closeCallback?: () => void;

  /**
   * Handles incoming TCP data.
   */
  private readonly handleData = (
    data: Buffer | string,
  ): void => {
    this.dataCallback?.(data);

    const chunk = Buffer.isBuffer(data)
      ? data
      : Buffer.from(data);

    const frames = this.frameParser.push(chunk);

    if (!this.frameCallback) {
      return;
    }

    for (const frame of frames) {
      this.frameCallback(frame);
    }
  };

  /**
   * Handles socket errors.
   */
  private readonly handleError = (
    error: Error,
  ): void => {
    this.errorCallback?.(error);
  };

  /**
   * Handles a closed socket.
   */
  private readonly handleClose = (): void => {
    this.closeCallback?.();
  };

  /**
   * Returns whether the TCP socket is currently connected.
   */
  public get isConnected(): boolean {
    return (
      this.socket !== undefined &&
      !this.socket.destroyed &&
      this.socket.readyState === 'open'
    );
  }

  /**
   * Opens a TCP connection to the specified host and port.
   */
  public connect(
    host: string,
    port: number,
  ): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }

    this.destroySocket();
    this.frameParser.reset();

    const socket = new Socket();

    this.socket = socket;

    socket.on('data', this.handleData);
    socket.on('error', this.handleError);
    socket.on('close', this.handleClose);

    return new Promise((resolve, reject) => {
      const handleConnect = (): void => {
        socket.removeListener(
          'error',
          handleConnectionError,
        );

        resolve();
      };

      const handleConnectionError = (
        error: Error,
      ): void => {
        socket.removeListener(
          'connect',
          handleConnect,
        );

        this.destroySocket();
        reject(error);
      };

      socket.once('connect', handleConnect);
      socket.once(
        'error',
        handleConnectionError,
      );

      socket.connect(port, host);
    });
  }

  /**
   * Sends binary data over the active TCP connection.
   */
  public send(data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = this.socket;

      if (
        socket === undefined ||
        !this.isConnected
      ) {
        reject(
          new Error(
            'TCP socket is not connected',
          ),
        );
        return;
      }

      socket.write(data, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  /**
   * Registers a callback for incoming raw TCP data.
   */
  public onData(
    callback: (
      data: Buffer | string,
    ) => void,
  ): void {
    this.dataCallback = callback;
  }

  /**
   * Registers a callback for complete Modbus TCP frames.
   */
  public onFrame(
    callback: (
      frame: ModbusTcpFrame,
    ) => void,
  ): void {
    this.frameCallback = callback;
  }

  /**
   * Registers a callback for TCP connection errors.
   */
  public onError(
    callback: (
      error: Error,
    ) => void,
  ): void {
    this.errorCallback = callback;
  }

  /**
   * Registers a callback for a closed TCP connection.
   */
  public onClose(
    callback: () => void,
  ): void {
    this.closeCallback = callback;
  }

  /**
   * Closes the current TCP connection.
   */
  public disconnect(): void {
    this.frameParser.reset();
    this.destroySocket();
  }

  /**
   * Removes listeners and destroys the current socket.
   */
  private destroySocket(): void {
    const socket = this.socket;

    if (socket === undefined) {
      return;
    }

    socket.removeListener(
      'data',
      this.handleData,
    );

    socket.removeListener(
      'error',
      this.handleError,
    );

    socket.removeListener(
      'close',
      this.handleClose,
    );

    if (!socket.destroyed) {
      socket.destroy();
    }

    this.socket = undefined;
  }
}