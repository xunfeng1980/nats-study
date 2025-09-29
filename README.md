# NATS Polyglot Study Project

This project demonstrates NATS messaging patterns implemented in multiple programming languages.

## Project Requirements

1. All languages will start NATS and publish messages to the "talk" topic with the current time and their language identifier
2. All languages will start a NATS subscriber, subscribe to the "talk" topic, and print message contents
3. All languages will provide a request/reply interface, then start a NATS requestor to call this interface and print the return result
4. All languages will publish protobuf messages to the "talk-pb" topic
5. All languages will subscribe to the "talk-pb" topic and print protobuf message contents
6. All languages will provide a protobuf request/reply interface, then start a NATS requestor to call this interface and print the return result

## Languages Included

- Python (`python/`)
- JavaScript/Node.js (`javascript/`)
- Java (`java/`)
- C++ (`cpp/`)
- Rust (`rust/`)

## Directory Structure

Each language implementation is contained in its own directory with all necessary build files and dependencies.

## Prerequisites

- Docker and Docker Compose (for running NATS server)
- Language-specific development tools (see individual README files)
- Protocol Buffers compiler (protoc) for generating language-specific protobuf classes

## Running the NATS Server

Start the NATS cluster using Docker Compose:

```bash
docker-compose up
```

## Running Individual Language Implementations

See the README file in each language directory for specific instructions.

## Running All Languages Simultaneously

Use the provided script to run all implementations at once:

```bash
./run-all.sh
```

This will start all language implementations simultaneously and allow them to exchange messages through the NATS server.