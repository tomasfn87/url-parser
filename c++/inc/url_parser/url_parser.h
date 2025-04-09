#pragma once

#include <string>
#include <map>
#include <regex>
#include <variant>
#include <vector>

struct KeyOptionalValue {
    std::string key;
    std::string value;
};

struct Fragment {
    std::string base_string;
    std::vector<std::string> fragment_list;
    std::vector<KeyOptionalValue> fragment_map;
};

struct Parameter {
    std::string base_string;
    std::vector<std::string> parameter_list;
    std::vector<KeyOptionalValue> parameter_map;
};

struct ParsedUrl {
    std::string domain;
    std::string path;
    Parameter parameter;
    Fragment fragment;
};

class Url {
public:
    Url();
    Url(std::string url);
    ~Url();
    void print_colored_url();
    void print_parsed_url();
private:
    std::string url;
    ParsedUrl parsed_url;
    std::regex url_parts = std::regex(
        R"(^((?:\w+:\/\/)?[^\/]+\.[^\/]+)((?:\/[^\/?#]*)*)(\?\S*?)?(#\S*)?$)",
        std::regex_constants::ECMAScript | std::regex_constants::icase
    );
    void parse_url();
    std::string color_str(std::string s, std::string color);
    std::string color_reset = "\x1b[0m";
    std::string color_dim = "\x1b[2m";
    std::string color_1 = "\x1b[95m";
    std::string color_2 = "\x1b[33m";
    std::string color_3 = "\x1b[36m";
    std::string color_3_1 = "\x1b[96m";
    std::string color_4 = "\x1b[34m";
    std::string color_4_1 = "\x1b[94m";
    void print_key_optional_value_list(
        std::vector<KeyOptionalValue> list, std::string color);
};
