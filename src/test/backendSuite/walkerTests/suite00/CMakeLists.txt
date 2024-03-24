cmake_minimum_required(VERSION 3.20)

project(AstWalkerTestssuite00)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(AstWalkerTestssuite00Exe
    main.cpp
    simple_c_style_func.cpp
)

target_include_directories(AstWalkerTestssuite00Exe
    PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}
)
