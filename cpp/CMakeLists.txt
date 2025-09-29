cmake_minimum_required(VERSION 3.15)

# Project information
project(nats-cpp-client VERSION 1.0.0 LANGUAGES CXX)

# C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find vcpkg packages
find_package(cnats CONFIG REQUIRED)
find_package(Protobuf REQUIRED)
find_package(absl CONFIG REQUIRED)

# Include directories
include_directories(${Protobuf_INCLUDE_DIRS})
include_directories(${CMAKE_CURRENT_BINARY_DIR})

# Create executable
add_executable(app 
    app.cpp
    proto/messages.pb.cc
)

# Link libraries
target_link_libraries(app PRIVATE 
    cnats::nats_static
    protobuf::libprotobuf
    absl::strings
    absl::str_format
    absl::log
    absl::base
    absl::synchronization
    absl::status
    absl::cord
)

# Compiler options
target_compile_options(app PRIVATE 
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra>
)

# Installation rules
install(TARGETS app DESTINATION bin)