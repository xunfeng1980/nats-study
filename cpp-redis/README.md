# C++ NATS Client

This directory contains the C++ implementation of the NATS client.

## Prerequisites

- [vcpkg](https://github.com/Microsoft/vcpkg)
- C++ compiler (g++ or clang++)
- [CMake](https://cmake.org/) 3.15 or higher
- [Ninja](https://ninja-build.org/)

## Installation

### Using vcpkg (recommended)

1. Install vcpkg if not already installed:
   ```bash
   git clone https://github.com/Microsoft/vcpkg.git
   cd vcpkg
   ./bootstrap-vcpkg.sh
   ./vcpkg integrate install
   ```

2. Set the VCPKG_ROOT environment variable:
   ```bash
   export VCPKG_ROOT=/path/to/vcpkg
   ```

> **Note**: This project uses vcpkg version locking to ensure reproducible builds. 
> Dependencies are locked to specific versions in `vcpkg.json` using a baseline commit 
> and explicit version overrides.

## Building

### Using CMake Presets (recommended)

1. Configure the project:
   ```bash
   cmake --preset=default
   ```

2. Build the project:
   ```bash
   cmake --build --preset=default
   ```

### Manual CMake build

1. Create a build directory:
   ```bash
   mkdir build
   cd build
   ```

2. Configure with CMake:
   ```bash
   cmake .. -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake -G Ninja
   ```

3. Build the project:
   ```bash
   ninja
   ```

## Running

```bash
./build/app
```

## Cleaning

To clean the build files:
```bash
rm -rf build
```