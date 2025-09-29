# Rust NATS Client

This directory contains the Rust implementation of the NATS client.

## Prerequisites

- Rust and Cargo (install via [rustup](https://rustup.rs/))

## Building

```bash
cargo build
```

## Running

```bash
# Run the synchronous version
cargo run --bin app

# Run the asynchronous version
cargo run --bin async-app