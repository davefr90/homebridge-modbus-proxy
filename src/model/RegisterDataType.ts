/**
 * Supported Modbus register data types.
 */
export enum RegisterDataType {
  Boolean = 'boolean',

  Uint16 = 'uint16',
  Int16 = 'int16',

  Uint32 = 'uint32',
  Int32 = 'int32',

  Float32 = 'float32',

  String = 'string',
}