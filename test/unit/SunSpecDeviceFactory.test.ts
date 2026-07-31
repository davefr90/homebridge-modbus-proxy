import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  SunSpecDiscoveryResult,
} from '../../src/sunspec/discovery/SunSpecDiscoveryResult.js';

import {
  CommonModel,
} from '../../src/sunspec/models/CommonModel.js';

import {
  InverterModel103,
} from '../../src/sunspec/models/InverterModel103.js';

import {
  MeterModel203,
} from '../../src/sunspec/models/MeterModel203.js';

import {
  NameplateModel120,
} from '../../src/sunspec/models/NameplateModel120.js';

import {
  SunSpecDeviceFactory,
} from '../../src/sunspec/SunSpecDeviceFactory.js';

describe(
  'SunSpecDeviceFactory',
  () => {

    it(
      'creates an empty device when no supported models were discovered',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          0,
        );

      },
    );

    it(
      'creates the padded SunSpec Common Model',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  40002,
                dataAddress:
                  40004,
                length:
                  CommonModel.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          1,
        );

        expect(
          device.hasModel(
            CommonModel.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.model(
            CommonModel.MODEL_ID,
          ).name,
        ).toBe(
          'Common',
        );

      },
    );

    it(
      'creates the unpadded SunSpec Common Model',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  40002,
                dataAddress:
                  40004,
                length:
                  CommonModel.MODEL_LENGTH_WITHOUT_PAD,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          1,
        );

        expect(
          device.hasModel(
            CommonModel.MODEL_ID,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'creates all currently supported models',
      () => {

        const commonHeaderAddress =
          40002;

        const inverterHeaderAddress =
          commonHeaderAddress
          + 2
          + CommonModel.MODEL_LENGTH;

        const nameplateHeaderAddress =
          inverterHeaderAddress
          + 2
          + InverterModel103.MODEL_LENGTH;

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  commonHeaderAddress,
                dataAddress:
                  commonHeaderAddress + 2,
                length:
                  CommonModel.MODEL_LENGTH,
              },
              {
                id:
                  InverterModel103.MODEL_ID,
                headerAddress:
                  inverterHeaderAddress,
                dataAddress:
                  inverterHeaderAddress + 2,
                length:
                  InverterModel103.MODEL_LENGTH,
              },
              {
                id:
                  NameplateModel120.MODEL_ID,
                headerAddress:
                  nameplateHeaderAddress,
                dataAddress:
                  nameplateHeaderAddress + 2,
                length:
                  NameplateModel120.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          3,
        );

        expect(
          device.hasModel(
            CommonModel.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            InverterModel103.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            NameplateModel120.MODEL_ID,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'creates the SolarEdge model chain with an embedded meter',
      () => {

        const commonHeaderAddress =
          40002;

        const inverterHeaderAddress =
          commonHeaderAddress
          + 2
          + CommonModel.MODEL_LENGTH_WITHOUT_PAD;

        const embeddedCommonHeaderAddress =
          inverterHeaderAddress
          + 2
          + InverterModel103.MODEL_LENGTH;

        const meterHeaderAddress =
          embeddedCommonHeaderAddress
          + 2
          + CommonModel.MODEL_LENGTH_WITHOUT_PAD;

        const result =
          new SunSpecDiscoveryResult(
            2,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  commonHeaderAddress,
                dataAddress:
                  commonHeaderAddress + 2,
                length:
                  CommonModel.MODEL_LENGTH_WITHOUT_PAD,
              },
              {
                id:
                  InverterModel103.MODEL_ID,
                headerAddress:
                  inverterHeaderAddress,
                dataAddress:
                  inverterHeaderAddress + 2,
                length:
                  InverterModel103.MODEL_LENGTH,
              },
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  embeddedCommonHeaderAddress,
                dataAddress:
                  embeddedCommonHeaderAddress + 2,
                length:
                  CommonModel.MODEL_LENGTH_WITHOUT_PAD,
              },
              {
                id:
                  MeterModel203.MODEL_ID,
                headerAddress:
                  meterHeaderAddress,
                dataAddress:
                  meterHeaderAddress + 2,
                length:
                  MeterModel203.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          3,
        );

        expect(
          device.hasModel(
            CommonModel.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            InverterModel103.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.hasModel(
            MeterModel203.MODEL_ID,
          ),
        ).toBe(
          true,
        );

        expect(
          device.meter,
        ).toBeDefined();

      },
    );

    it(
      'uses the Modbus unit ID from the discovery result',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            17,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  40002,
                dataAddress:
                  40004,
                length:
                  CommonModel.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        const commonModel =
          device.model(
            CommonModel.MODEL_ID,
          );

        const manufacturer =
          commonModel.registerMap.get(
            'manufacturer',
          );

        expect(
          manufacturer.unitId,
        ).toBe(
          17,
        );

      },
    );

    it(
      'uses the discovered base address for the Common Model',
      () => {

        const baseAddress =
          50000;

        const result =
          new SunSpecDiscoveryResult(
            1,
            baseAddress,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  baseAddress + 2,
                dataAddress:
                  baseAddress + 4,
                length:
                  CommonModel.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        const commonModel =
          device.model(
            CommonModel.MODEL_ID,
          );

        const manufacturer =
          commonModel.registerMap.get(
            'manufacturer',
          );

        expect(
          manufacturer.address,
        ).toBe(
          baseAddress + 4,
        );

      },
    );

    it(
      'uses the discovered header address for model 103',
      () => {

        const headerAddress =
          42000;

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  InverterModel103.MODEL_ID,
                headerAddress,
                dataAddress:
                  headerAddress + 2,
                length:
                  InverterModel103.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        const inverterModel =
          device.model(
            InverterModel103.MODEL_ID,
          );

        const firstRegister =
          inverterModel.registerMap
            .entries()[0];

        expect(
          firstRegister,
        ).toBeDefined();

        expect(
          firstRegister?.[1].address,
        ).toBeGreaterThanOrEqual(
          headerAddress + 2,
        );

      },
    );

    it(
      'uses the discovered header address for model 120',
      () => {

        const headerAddress =
          43000;

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  NameplateModel120.MODEL_ID,
                headerAddress,
                dataAddress:
                  headerAddress + 2,
                length:
                  NameplateModel120.MODEL_LENGTH,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        const nameplateModel =
          device.model(
            NameplateModel120.MODEL_ID,
          );

        const firstRegister =
          nameplateModel.registerMap
            .entries()[0];

        expect(
          firstRegister,
        ).toBeDefined();

        expect(
          firstRegister?.[1].address,
        ).toBeGreaterThanOrEqual(
          headerAddress + 2,
        );

      },
    );

    it(
      'ignores unsupported SunSpec models',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id: 999,
                headerAddress: 40002,
                dataAddress: 40004,
                length: 10,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          0,
        );

        expect(
          device.hasModel(
            999,
          ),
        ).toBe(
          false,
        );

      },
    );

    it(
      'keeps supported models when unsupported models are present',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  40002,
                dataAddress:
                  40004,
                length:
                  CommonModel.MODEL_LENGTH,
              },
              {
                id: 999,
                headerAddress: 40070,
                dataAddress: 40072,
                length: 10,
              },
            ],
          );

        const device =
          SunSpecDeviceFactory.create(
            result,
          );

        expect(
          device.size(),
        ).toBe(
          1,
        );

        expect(
          device.hasModel(
            CommonModel.MODEL_ID,
          ),
        ).toBe(
          true,
        );

      },
    );

    it(
      'rejects an invalid Common Model length',
      () => {

        const invalidLength =
          CommonModel.MODEL_LENGTH_WITHOUT_PAD
          - 1;

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  CommonModel.MODEL_ID,
                headerAddress:
                  40002,
                dataAddress:
                  40004,
                length:
                  invalidLength,
              },
            ],
          );

        expect(
          () =>
            SunSpecDeviceFactory.create(
              result,
            ),
        ).toThrow(
          'Invalid length for SunSpec model ' +
          `${CommonModel.MODEL_ID}: expected ` +
          `${CommonModel.MODEL_LENGTH_WITHOUT_PAD} or ` +
          `${CommonModel.MODEL_LENGTH}, received ` +
          `${invalidLength}.`,
        );

      },
    );

    it(
      'rejects an invalid model 103 length',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  InverterModel103.MODEL_ID,
                headerAddress:
                  40070,
                dataAddress:
                  40072,
                length:
                  InverterModel103.MODEL_LENGTH + 1,
              },
            ],
          );

        expect(
          () =>
            SunSpecDeviceFactory.create(
              result,
            ),
        ).toThrow(
          'Invalid length for SunSpec model ' +
          `${InverterModel103.MODEL_ID}`,
        );

      },
    );

    it(
      'rejects an invalid model 120 length',
      () => {

        const result =
          new SunSpecDiscoveryResult(
            1,
            40000,
            [
              {
                id:
                  NameplateModel120.MODEL_ID,
                headerAddress:
                  40122,
                dataAddress:
                  40124,
                length:
                  NameplateModel120.MODEL_LENGTH + 1,
              },
            ],
          );

        expect(
          () =>
            SunSpecDeviceFactory.create(
              result,
            ),
        ).toThrow(
          'Invalid length for SunSpec model ' +
          `${NameplateModel120.MODEL_ID}`,
        );

      },
    );

  },
);