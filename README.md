# homebridge-modbus-proxy

A multi-client Modbus TCP proxy and SolarEdge plant monitor for Homebridge.

![Status](https://img.shields.io/badge/status-active%20development-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-22%20or%2024-green)

## Overview

`homebridge-modbus-proxy` lets multiple Modbus TCP clients share one upstream
connection to a target device. Downstream requests are serialized before they
are forwarded, which protects devices that do not tolerate several parallel
requests or client connections reliably.

The plugin can also monitor a multi-inverter SolarEdge plant. The current
SolarEdge integration supports:

- SunSpec discovery
- SunSpec inverter model 103
- SunSpec meter model 203
- SunSpec storage model 713
- SolarEdge battery register blocks
- Aggregated plant snapshots
- Persistent monitoring with consistency checks and retries

The proxy server and SolarEdge monitoring are independent optional services.
Either one or both may be enabled.

## Modbus TCP proxy

The proxy opens one shared connection to the configured target. Wallboxes,
energy-management systems and other Modbus clients connect to the Homebridge
host instead of connecting directly to the target.

```text
Wallbox ---------\
Energy manager ---+--> Homebridge proxy :1502 --> SolarEdge :502
Diagnostics -----/
```

Each client continues to use the original Modbus unit ID. For example, when a
SolarEdge installation exposes inverter units 2 and 3, a client selects unit 2
or unit 3 exactly as it would on a direct connection.

Example Homebridge configuration:

```json
{
  "platform": "ModbusProxy",
  "name": "Modbus Proxy",
  "modbusProxy": {
    "targetHost": "192.168.2.101",
    "targetPort": 502,
    "listenHost": "0.0.0.0",
    "listenPort": 1502
  }
}
```

With Homebridge running at `192.168.2.159`, downstream clients use:

- Host: `192.168.2.159`
- Port: `1502`
- Unit ID: the unit required by the target, for example `2`

Port `1502` avoids the privileged-port restrictions commonly associated with
port `502` on Linux. The selected listen port must be permitted by the host
firewall and must not already be used by another process.

## SolarEdge plant monitoring

Example configuration for a plant with inverter units 2 and 3 and meter model
203 inside unit 2:

```json
{
  "platform": "ModbusProxy",
  "name": "Modbus Proxy",
  "solarEdge": {
    "host": "192.168.2.101",
    "port": 502,
    "unitIds": [2, 3],
    "meterUnitId": 2,
    "pollIntervalMs": 5000,
    "meterConsistencyThresholdWatts": 500,
    "snapshotRetryCount": 1
  }
}
```

Both services can be placed in the same platform object:

```json
{
  "platform": "ModbusProxy",
  "name": "Modbus Proxy",
  "modbusProxy": {
    "targetHost": "192.168.2.101",
    "targetPort": 502,
    "listenHost": "0.0.0.0",
    "listenPort": 1502
  },
  "solarEdge": {
    "host": "192.168.2.101",
    "port": 502,
    "unitIds": [2, 3],
    "meterUnitId": 2,
    "pollIntervalMs": 5000,
    "meterConsistencyThresholdWatts": 500,
    "snapshotRetryCount": 1
  }
}
```

## Development

Install dependencies:

```bash
npm install
```

Run all quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Useful real-device examples:

```bash
npm run example:discover
npm run example:meter-snapshot
npm run example:storage-snapshot
npm run example:battery-snapshot
npm run example:plant-snapshot
npm run example:plant-monitor
```

## License

Licensed under the MIT License.
