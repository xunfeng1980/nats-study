#!/bin/bash

# Script to run all NATS client implementations simultaneously

echo "Starting all NATS client implementations..."

# Start C++ implementation
echo "Starting C++ client..."
cd cpp
make clean
make
./app &
CPP_PID=$!
cd ..

# Start Java implementation
echo "Starting Java client..."
cd java
mvn compile
mvn exec:java &
JAVA_PID=$!
cd ..

# Start Python implementation
echo "Starting Python client..."
cd python
pip install -r requirements.txt
python app.py &
PYTHON_PID=$!
cd ..

# Start JavaScript implementation
echo "Starting JavaScript client..."
cd javascript
npm install
npm start &
JAVASCRIPT_PID=$!
cd ..

# Start Rust implementation
echo "Starting Rust client..."
cd rust
cargo run --bin app &
RUST_PID=$!
cd ..

# Wait for all processes to complete or for a timeout
echo "All clients started. Waiting for 30 seconds to allow message exchange..."
sleep 30

# Kill all background processes
echo "Stopping all clients..."
kill $CPP_PID $JAVA_PID $PYTHON_PID $JAVASCRIPT_PID $RUST_PID 2>/dev/null

echo "All clients stopped."