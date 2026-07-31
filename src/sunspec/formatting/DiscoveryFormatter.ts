import type {
  SunSpecDiscoveredModel,
} from '../discovery/SunSpecDiscoveredModel.js';

import type {
  SunSpecDeviceInformation,
} from '../devices/SunSpecDeviceInformation.js';

/**
 * Formats SunSpec discovery information for display
 * in development tools and command-line applications.
 */
export class DiscoveryFormatter {

  /**
   * Formats complete SunSpec device information.
   */
  public static format(
    information: SunSpecDeviceInformation,
  ): string {

    const models =
      information.models();

    const lines: string[] = [
      '============================================================',
      'SunSpec Device Discovery',
      '============================================================',
      '',
      `Modbus Unit ID : ${information.unitId}`,
      `Base Address   : ${information.baseAddress}`,
      `Model Count    : ${information.size()}`,
      '',
      'Discovered Models',
      '------------------------------------------------------------',
      DiscoveryFormatter.formatTableHeader(),
      DiscoveryFormatter.formatTableSeparator(),
    ];

    for (
      let index = 0;
      index < models.length;
      index += 1
    ) {

      const model =
        models[index];

      lines.push(
        DiscoveryFormatter.formatModel(
          model,
          index + 1,
        ),
      );

    }

    lines.push(
      '',
      'Model Summary',
      '------------------------------------------------------------',
    );

    const uniqueModelIds =
      information.modelIds();

    for (
      const modelId
      of uniqueModelIds
    ) {

      const instances =
        information.modelsById(
          modelId,
        );

      lines.push(
        `${modelId.toString().padStart(5)}  ` +
        `${DiscoveryFormatter.modelName(modelId).padEnd(28)}  ` +
        `${instances.length} instance${instances.length === 1 ? '' : 's'}`,
      );

    }

    lines.push(
      '',
      '============================================================',
    );

    return lines.join(
      '\n',
    );

  }

  /**
   * Formats the table heading.
   */
  private static formatTableHeader():
    string {

    return [
      '#'.padStart(3),
      'ID'.padStart(6),
      'Name'.padEnd(28),
      'Length'.padStart(8),
      'Header'.padStart(8),
      'Data'.padStart(8),
    ].join(
      '  ',
    );

  }

  /**
   * Formats the separator below the table heading.
   */
  private static formatTableSeparator():
    string {

    return [
      '-'.repeat(3),
      '-'.repeat(6),
      '-'.repeat(28),
      '-'.repeat(8),
      '-'.repeat(8),
      '-'.repeat(8),
    ].join(
      '  ',
    );

  }

  /**
   * Formats one discovered model.
   */
  private static formatModel(
    model: SunSpecDiscoveredModel,
    instanceNumber: number,
  ): string {

    return [
      instanceNumber
        .toString()
        .padStart(3),

      model.id
        .toString()
        .padStart(6),

      DiscoveryFormatter
        .modelName(
          model.id,
        )
        .padEnd(28),

      model.length
        .toString()
        .padStart(8),

      model.headerAddress
        .toString()
        .padStart(8),

      model.dataAddress
        .toString()
        .padStart(8),
    ].join(
      '  ',
    );

  }

  /**
   * Returns the human-readable name of a model currently
   * known by the library.
   *
   * Unknown models are deliberately retained in the
   * discovery output so they can be implemented later.
   */
  private static modelName(
    modelId: number,
  ): string {

    switch (
      modelId
    ) {

    case 1:
      return 'Common';

    case 103:
      return 'Three-Phase Inverter';

    case 120:
      return 'Nameplate';

    default:
      return 'Unknown / not implemented';

    }

  }

}