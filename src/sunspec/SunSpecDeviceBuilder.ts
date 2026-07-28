import { CommonModel } from './models/CommonModel.js';
import { InverterModel103 } from './models/InverterModel103.js';
import { NameplateModel120 } from './models/NameplateModel120.js';
import { SunSpecModelContainer } from './SunSpecModelContainer.js';

export class SunSpecDeviceBuilder {

  private readonly container =
    new SunSpecModelContainer();

  private modbusUnitId = 1;

  /**
   * Zero-based SunSpec Modbus protocol base address.
   *
   * The SunSpec identifier occupies the first two registers.
   * Therefore, the first model header begins at baseAddress + 2.
   */
  private readonly baseAddress =
    CommonModel.DEFAULT_BASE_ADDRESS;

  /**
   * Address at which the next model-ID register will be placed.
   */
  private nextModelStartAddress =
    this.baseAddress + 2;

  public static create(): SunSpecDeviceBuilder {

    return new SunSpecDeviceBuilder();

  }

  /**
   * Sets the Modbus unit identifier used by all subsequently
   * created SunSpec models.
   *
   * @param unitId Modbus unit identifier from 1 to 247.
   */
  public unitId(
    unitId: number,
  ): SunSpecDeviceBuilder {

    if (
      !Number.isInteger(
        unitId,
      )
      || unitId < 1
      || unitId > 247
    ) {
      throw new Error(
        `Invalid Modbus unit ID: ${unitId}`,
      );
    }

    this.modbusUnitId =
      unitId;

    return this;

  }

  public common(): SunSpecDeviceBuilder {

    this.container.add(
      CommonModel.create(
        this.modbusUnitId,
        this.baseAddress,
      ),
    );

    this.nextModelStartAddress =
      this.baseAddress
      + 2
      + 2
      + CommonModel.MODEL_LENGTH;

    return this;

  }

  public model103(): SunSpecDeviceBuilder {

    this.container.add(
      InverterModel103.create(
        this.modbusUnitId,
        this.nextModelStartAddress,
      ),
    );

    this.nextModelStartAddress +=
      2
      + InverterModel103.MODEL_LENGTH;

    return this;

  }

  public model120(): SunSpecDeviceBuilder {

    this.container.add(
      NameplateModel120.create(
        this.modbusUnitId,
        this.nextModelStartAddress,
      ),
    );

    this.nextModelStartAddress +=
      2
      + NameplateModel120.MODEL_LENGTH;

    return this;

  }

  public build(): SunSpecModelContainer {

    return this.container;

  }

}