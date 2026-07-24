import {
  AddressInfo,
  createServer,
  Server,
  Socket,
} from 'node:net';

import { ConnectionManager } from './ConnectionManager.js';
import { ProxySession } from './ProxySession.js';

/**
 * Accepts incoming TCP clients and manages their proxy sessions.
 */
export class ProxyServer {
  private server?: Server;

  private readonly sessions =
    new Set<ProxySession>();

  private listeningPort?: number;

  public constructor(
    private readonly connectionManager: ConnectionManager,
  ) {}

  /**
   * Returns whether the TCP server is currently running.
   */
  public get isRunning(): boolean {
    return (
      this.server !== undefined &&
      this.server.listening
    );
  }

  /**
   * Returns the active TCP listening port.
   */
  public get port(): number {
    if (this.listeningPort === undefined) {
      throw new Error(
        'Proxy server is not running.',
      );
    }

    return this.listeningPort;
  }

  /**
   * Returns the number of connected client sessions.
   */
  public get sessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Starts the TCP proxy server.
   *
   * Port 0 lets the operating system select an available port.
   */
  public start(
    port = 0,
    host = '127.0.0.1',
  ): Promise<void> {
    if (this.server !== undefined) {
      return Promise.reject(
        new Error(
          'Proxy server is already running.',
        ),
      );
    }

    if (!this.connectionManager.isConnected()) {
      return Promise.reject(
        new Error(
          'Target Modbus client is not connected.',
        ),
      );
    }

    const server = createServer(
      (socket) => {
        this.handleConnection(socket);
      },
    );

    this.server = server;

    return new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        const handleListening = (): void => {
          server.removeListener(
            'error',
            handleStartError,
          );

          const address = server.address();

          if (
            address === null ||
            typeof address === 'string'
          ) {
            this.resetServer();

            reject(
              new Error(
                'Unable to determine proxy server port.',
              ),
            );

            return;
          }

          this.listeningPort =
            (address as AddressInfo).port;

          resolve();
        };

        const handleStartError = (
          error: Error,
        ): void => {
          server.removeListener(
            'listening',
            handleListening,
          );

          this.resetServer();
          reject(error);
        };

        server.once(
          'listening',
          handleListening,
        );

        server.once(
          'error',
          handleStartError,
        );

        server.listen(
          port,
          host,
        );
      },
    );
  }

  /**
   * Stops the TCP server and disconnects all client sessions.
   */
  public async stop(): Promise<void> {
    const server = this.server;

    if (server === undefined) {
      return;
    }

    for (
      const session
      of [...this.sessions]
    ) {
      session.disconnect();
    }

    this.sessions.clear();
    this.server = undefined;
    this.listeningPort = undefined;

    if (!server.listening) {
      return;
    }

    await new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        server.close((error) => {
          if (error !== undefined) {
            reject(error);
            return;
          }

          resolve();
        });
      },
    );
  }

  /**
   * Creates a session for an incoming TCP client.
   */
  private handleConnection(
    socket: Socket,
  ): void {
    const session =
      new ProxySession(
        socket,
        this.connectionManager,
        (closedSession) => {
          this.sessions.delete(
            closedSession,
          );
        },
      );

    this.sessions.add(session);
  }

  /**
   * Clears the internal server state after a failed start.
   */
  private resetServer(): void {
    const server = this.server;

    this.server = undefined;
    this.listeningPort = undefined;

    if (
      server !== undefined &&
      !server.listening
    ) {
      server.removeAllListeners();
    }
  }
}