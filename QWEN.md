# NATS Study Project

## Project Overview

This is a polyglot demonstration project showcasing NATS messaging patterns implemented in multiple programming languages. The project implements three core NATS patterns:

1. **Publish/Subscribe**: Each language implementation publishes messages to a "talk" topic with the current time and language identifier
2. **Subscription**: Each language subscribes to the "talk" topic and prints received messages
3. **Request/Reply**: Each language provides a request-reply interface and makes requests to test this functionality

## Languages Included

- Python (`python/`)
- JavaScript/Node.js (`javascript/`)
- Java (`java/`)
- C++ (`cpp/`)
- Rust (`rust/`)

## Project Requirements

Based on the README, each implementation should:

1. Start a NATS connection and publish messages to the "talk" topic with current time and language identifier
2. Subscribe to the "talk" topic and print incoming messages
3. Implement a request/reply service and make requests to test the functionality

## Directory Structure

```
.
├── cpp/
│   ├── app.cpp
│   ├── Makefile
│   └── README.md
├── java/
│   ├── App.java
│   ├── pom.xml
│   └── README.md
├── python/
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
├── javascript/
│   ├── app.js
│   ├── package.json
│   └── README.md
├── rust/
│   ├── app.rs
│   ├── async_app.rs
│   ├── Cargo.toml
│   └── README.md
├── nats-1-data/
├── nats-2-data/
├── node_modules/
├── docker-compose.yaml
├── nats-readme.md
├── nats-rust-readme.md
├── package-lock.json
├── run-all.sh
└── README.md
```

## NATS Server Configuration

The project includes a Docker Compose configuration (`docker-compose.yaml`) that sets up a NATS cluster with JetStream enabled:

- `nats-1`: Running on ports 4222 (client) and 8222 (monitoring)
- `nats-2`: Running on ports 4223 (client) and 8223 (monitoring)
- Both instances are connected in a cluster named "JSCLUSTER"

To start the NATS cluster:
```bash
docker-compose up
```

## Building and Running Individual Languages

### C++ (`cpp/`)

**Prerequisites**: NATS C client library, C++ compiler, Make

```bash
cd cpp
make
./app
```

### Java (`java/`)

**Prerequisites**: Java 11+, Maven

```bash
cd java
mvn compile
mvn exec:java
```

### Python (`python/`)

**Prerequisites**: Python 3.7+, pip

```bash
cd python
pip install -r requirements.txt
python app.py
```

### JavaScript (`javascript/`)

**Prerequisites**: Node.js 12+, npm

```bash
cd javascript
npm install
npm start
```

### Rust (`rust/`)

**Prerequisites**: Rust and Cargo

```bash
cd rust
cargo run --bin app
```

## Running All Languages at Once

A script (`run-all.sh`) is provided to start all language implementations simultaneously:

```bash
./run-all.sh
```

This script will:
1. Start all language implementations in separate background processes
2. Wait for a specified time to allow message exchange
3. Terminate all processes

## Development Conventions

Each implementation follows the same pattern:
1. Connect to NATS server at `nats://localhost:4222`
2. Publish a message to the "talk" topic with the current time and language identifier
3. Subscribe to the "talk" topic to receive messages from other language implementations
4. Provide a request/reply service on a language-specific subject
5. Make a request to test the request/reply functionality
6. Keep connections alive for 10 seconds to allow message exchange
7. Cleanly close all connections

## Additional Resources

- `nats-readme.md`: Detailed documentation on the NATS C client library
- `nats-rust-readme.md`: Detailed documentation on the NATS Rust client library

## Development Status

All implementations have been completed and follow NATS best practices for their respective languages. The implementations have been verified for consistency in connection parameters and request/reply subject naming.