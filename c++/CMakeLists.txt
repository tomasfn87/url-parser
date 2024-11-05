cmake_minimum_required(VERSION 3.22)

project (
    UrlParser
    VERSION 0.0.1
    LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD          17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS        OFF)

set(EXECUTABLE_NAME app)
set(URL_PARSER url_parser)

add_subdirectory(src)
add_subdirectory(inc)
add_subdirectory(app)

