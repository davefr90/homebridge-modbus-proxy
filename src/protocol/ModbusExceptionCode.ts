export enum ModbusExceptionCode {
    IllegalFunction = 1,
    IllegalDataAddress = 2,
    IllegalDataValue = 3,
    ServerDeviceFailure = 4,
    Acknowledge = 5,
    ServerDeviceBusy = 6,
    NegativeAcknowledge = 7,
    MemoryParityError = 8,
    GatewayPathUnavailable = 10,
    GatewayTargetDeviceFailedToRespond = 11,
}