import { Socket } from 'node:net';

/**
 * Handles a single TCP connection.
 */
export class TcpConnection {

  private socket: Socket;

  constructor() {
    this.socket = new Socket();
  }

  /**
   * Returns whether the TCP socket is currently connected.
   */
  public get isConnected(): boolean {
    return !this.socket.destroyed && this.socket.readyState === 'open';
  }

  /**
   * Opens a TCP connection to the specified host and port.
   */
  public connect(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleConnect = (): void => {
        this.socket.removeListener('error', handleError);
        resolve();
      };

      const handleError = (error: Error): void => {
        this.socket.removeListener('connect', handleConnect);
        reject(error);
      };

      this.socket.once('connect', handleConnect);
      this.socket.once('error', handleError);
      this.socket.connect(port, host);
    });
  }

  /**
   * Sends binary data over the active TCP connection.
   */
  public send(data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('TCP socket is not connected'));
        return;
      }

      this.socket.write(data, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  /**
   * Registers a callback for incoming TCP data.
   */
  public onData(callback: (data: Buffer) => void): void {
    this.socket.on('data', callback);
  }

  /**
   * Registers a callback for TCP connection errors.
   */
  public onError(callback: (error: Error) => void): void {
    this.socket.on('error', callback);
  }

  /**
   * Registers a callback for a closed TCP connection.
   */
  public onClose(callback: () => void): void {
    this.socket.on('close', callback);
  }

  /**
   * Closes the current TCP connection.
   */
  public disconnect(): void {
    if (this.socket.destroyed) {
      return;
    }

    this.socket.destroy();
  }

}