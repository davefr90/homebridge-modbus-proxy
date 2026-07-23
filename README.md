# homebridge-modbus-proxy

A high-performance Modbus TCP proxy plugin for Homebridge.

## Status

This project is currently under active development and is not yet ready for production use.

## Planned Features

- Multiple Modbus TCP devices
- Multiple simultaneous Modbus clients
- Request queue
- Automatic reconnect
- Register cache
- Connection statistics
- Web dashboard
- Register explorer
- Homebridge configuration integration

## Architecture

The project is divided into several independent layers:

```text
Homebridge
    │
    ▼
Modbus Proxy
    │
    ├── Request Queue
    ├── Cache
    ├── Statistics
    │
    ▼
Modbus Client
    │
    ▼
TCP Transport