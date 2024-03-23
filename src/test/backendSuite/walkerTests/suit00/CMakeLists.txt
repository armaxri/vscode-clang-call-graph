cmake_minimum_required(VERSION 3.20)

project(AstWalkerTestsSuit00)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_executable(AstWalkerTestsSuit00Exe
    main.cpp
    simple_c_style_func.cpp
)

target_include_directories(AstWalkerTestsSuit00Exe
    PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}
)
