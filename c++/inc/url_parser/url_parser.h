#pragma once

#include <string>
#include <map>
#include <regex>
#include <vector>

struct KeyOptionalValue {
    std::string key;
    std::string value;
};

struct KeyOptionalValueData {
    std::string base_string;
    std::vector<std::string> list;
    std::vector<KeyOptionalValue> map;
};

struct ParsedUrl {
    std::string domain;
    std::string path;
    KeyOptionalValueData parameter;
    KeyOptionalValueData fragment;
};

class Url {
public:
    Url();
    ~Url();
    Url(std::string url);
    void set_url(std::string new_url);
    void print_colored_url();
    void print_parsed_url();
private:
    std::string url;
    ParsedUrl parsed_url;
    std::regex url_parts = std::regex(
        R"(^((?:\w+:\/\/)?[^\/]+\.[^\/]+)((?:\/[^\/?#]*)*)(\?\S*?)?(#\S*)?$)",
        std::regex_constants::ECMAScript | std::regex_constants::icase
    );
    void remove_all_chars(std::string& target, char remove);
    void parse_url();
    void parse_key_optional_value_list(
        KeyOptionalValueData& target, std::string delimiter);
    void update_url();
    std::string color_reset = "\x1b[0m";
    std::string color_dim = "\x1b[2m";
    std::string color_1 = "\x1b[95m";
    std::string color_2 = "\x1b[33m";
    std::string color_3 = "\x1b[36m";
    std::string color_3_1 = "\x1b[96m";
    std::string color_4 = "\x1b[34m";
    std::string color_4_1 = "\x1b[94m";
    std::string color_str(std::string str, std::string color);
    void print_key_optional_value_list(
        std::vector<KeyOptionalValue> list, std::string color);
};
