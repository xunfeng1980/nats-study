cmake_minimum_required(VERSION 3.15)

# Project information
project(nats-cpp-client VERSION 1.0.0 LANGUAGES CXX)

# C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find vcpkg packages
find_package(cnats CONFIG REQUIRED)

# Find Protobuf
find_package(Protobuf REQUIRED)
include_directories(${PROTOBUF_INCLUDE_DIRS})
include_directories(${CMAKE_CURRENT_BINARY_DIR})

# Create executable
add_executable(app 
    app.cpp
    proto/messages.pb.cc
)

# Link libraries
target_link_libraries(app PRIVATE 
    cnats::nats_static
    ${PROTOBUF_LIBRARIES}
)

# Compiler options
target_compile_options(app PRIVATE 
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra>
)

# Installation rules
install(TARGETS app DESTINATION bin)