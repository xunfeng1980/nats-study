cmake_minimum_required(VERSION 3.15)

# Project information
project(redis-cpp-client VERSION 1.0.0 LANGUAGES CXX)

# C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find vcpkg packages
find_package(redis++ CONFIG REQUIRED)

# Create executables
add_executable(app 
    app.cpp
)

add_executable(publisher
    publisher.cpp
)

add_executable(subscriber
    subscriber.cpp
)

# Link libraries
target_link_libraries(app PRIVATE redis++::redis++_static)
target_link_libraries(publisher PRIVATE redis++::redis++_static)
target_link_libraries(subscriber PRIVATE redis++::redis++_static)

# Compiler options
target_compile_options(app PRIVATE 
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra>
)

target_compile_options(publisher PRIVATE 
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra>
)

target_compile_options(subscriber PRIVATE 
    $<$<CXX_COMPILER_ID:GNU,Clang,AppleClang>:-Wall -Wextra>
)

# Installation rules
install(TARGETS app publisher subscriber DESTINATION bin)