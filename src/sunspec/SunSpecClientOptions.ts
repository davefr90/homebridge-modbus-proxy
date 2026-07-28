export interface SunSpecClientOptions {

  /**
   * Hostname or IP address of the Modbus TCP server.
   */
  readonly host: string;

  /**
   * Modbus TCP port.
   *
   * @default 502
   */
  readonly port?: number;

  /**
   * Modbus unit identifier.
   *
   * @default 1
   */
  readonly unitId?: number;

  /**
   * Possible SunSpec base addresses used during discovery.
   *
   * @default [40000, 0]
   */
  readonly baseAddresses?: readonly number[];

}