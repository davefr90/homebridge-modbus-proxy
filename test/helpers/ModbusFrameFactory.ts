import { ModbusFunctionCode } from '../../src/protocol/ModbusFunctionCode.js';
import { ModbusTcpFrame } from '../../src/protocol/ModbusTcpFrame.js';

/**
 * Creates Modbus TCP response frames for integration tests.
 */
export class ModbusFrameFactory {

  /**
   * Creates a Read Holding Registers response.
   */
  public static createReadHoldingRegistersResponse(
    transactionId: number,
    unitId: number,
    values: number[],
  ): ModbusTcpFrame {

    const data = Buffer.alloc(
      1 + (values.length * 2),
    );

    data.writeUInt8(
      values.length * 2,
      0,
    );

    values.forEach((value, index) => {
      data.writeUInt16BE(
        value,
        1 + (index * 2),
      );
    });

    return new ModbusTcpFrame(
      transactionId,
      0,
      unitId,
      ModbusFunctionCode.ReadHoldingRegisters,
      data,
    );
  }

  /**
   * Creates a Read Input Registers response.
   */
  public static createReadInputRegistersResponse(
    transactionId: number,
    unitId: number,
    values: number[],
  ): ModbusTcpFrame {

    const data = Buffer.alloc(
      1 + (values.length * 2),
    );

    data.writeUInt8(
      values.length * 2,
      0,
    );

    values.forEach((value, index) => {
      data.writeUInt16BE(
        value,
        1 + (index * 2),
      );
    });

    return new ModbusTcpFrame(
      transactionId,
      0,
      unitId,
      ModbusFunctionCode.ReadInputRegisters,
      data,
    );
  }

  /**
   * Creates a Write Single Register response.
   */
  public static createWriteSingleRegisterResponse(
    transactionId: number,
    unitId: number,
    address: number,
    value: number,
  ): ModbusTcpFrame {

    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(value, 2);

    return new ModbusTcpFrame(
      transactionId,
      0,
      unitId,
      ModbusFunctionCode.WriteSingleRegister,
      data,
    );
  }

  /**
   * Creates a Write Multiple Registers response.
   */
  public static createWriteMultipleRegistersResponse(
    transactionId: number,
    unitId: number,
    address: number,
    quantity: number,
  ): ModbusTcpFrame {

    const data = Buffer.alloc(4);

    data.writeUInt16BE(address, 0);
    data.writeUInt16BE(quantity, 2);

    return new ModbusTcpFrame(
      transactionId,
      0,
      unitId,
      ModbusFunctionCode.WriteMultipleRegisters,
      data,
    );
  }
}