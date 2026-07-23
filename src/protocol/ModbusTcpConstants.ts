/**
 * Byte sizes used by Modbus TCP.
 */
export const MBAP_HEADER_SIZE = 7;
export const FUNCTION_CODE_SIZE = 1;
export const MIN_FRAME_SIZE =
  MBAP_HEADER_SIZE + FUNCTION_CODE_SIZE;

/**
 * Modbus TCP protocol identifier.
 */
export const MODBUS_PROTOCOL_ID = 0;

/**
 * Byte offsets inside a Modbus TCP frame.
 */
export const TRANSACTION_ID_OFFSET = 0;
export const PROTOCOL_ID_OFFSET = 2;
export const LENGTH_OFFSET = 4;
export const UNIT_ID_OFFSET = 6;
export const FUNCTION_CODE_OFFSET = 7;
export const DATA_OFFSET = 8;

/**
 * Number of bytes located before the section counted by the MBAP length field.
 */
export const PREFIX_SIZE = 6;

/**
 * Maximum supported Modbus TCP frame size.
 */
export const MAX_FRAME_SIZE = 260;