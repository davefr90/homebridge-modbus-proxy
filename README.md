# homebridge-modbus-proxy

A high-performance Modbus TCP proxy plugin for Homebridge.

> Modern, scalable and designed for industrial-grade Modbus TCP communication.

![Status](https://img.shields.io/badge/status-active%20development-orange)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D22-green)

---

## Overview

**homebridge-modbus-proxy** is a next-generation Modbus TCP proxy designed for Homebridge.

Instead of connecting multiple applications directly to a Modbus device, the proxy manages all communication through a single intelligent connection.

It provides:

- Request queueing
- Automatic reconnect
- Multiple simultaneous clients
- Register cache
- Connection statistics
- Future web dashboard
- Register explorer

---

## Architecture

```text
                         Homebridge
                              │
                              ▼
                    homebridge-modbus-proxy
         ┌────────────────────────────────────────┐
         │                                        │
         │  Request Queue                         │
         │  Register Cache                        │
         │  Statistics                            │
         │                                        │
         └────────────────────────────────────────┘
                              │
                              ▼
                      Modbus TCP Client
                              │
                              ▼
                      TCP Transport Layer
                              │
                              ▼
                      Modbus TCP Device
```

---

## Development Status

### Completed

- [x] Project architecture
- [x] Device configuration
- [x] TCP connection
- [x] Modbus TCP frame
- [x] Encoder
- [x] Decoder
- [x] Modbus function codes

### In Progress

- [ ] TCP stream parser
- [ ] Modbus client
- [ ] Request queue

### Planned

- [ ] Proxy server
- [ ] Register cache
- [ ] Statistics
- [ ] Dashboard
- [ ] Register explorer
- [ ] Homebridge configuration interface

---

## Build

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run build
```

Development mode:

```bash
npm run watch
```

---

## Project Goals

The project is designed with a strict separation of responsibilities.

```text
Transport
─────────
TCP connection

Protocol
────────
Frames
Encoder
Decoder
Parser

Core
────
Client
Proxy
Queue
Cache
Statistics

Homebridge
──────────
Configuration
Dashboard
```

This architecture allows the Modbus engine to remain largely independent from Homebridge and makes future extensions significantly easier.

---

## Roadmap

- Stable Modbus TCP core
- Intelligent request scheduler
- Advanced register cache
- Multi-client support
- Performance statistics
- Embedded web dashboard
- Register explorer
- Homebridge Verified plugin

---

## License

Licensed under the Apache License 2.0.