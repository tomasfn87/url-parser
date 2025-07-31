#pragma once

#include <string>
#include <map>
#include <regex>
#include <vector>

struct KeyOptionalValue {
    std::string key;
    std::string value;
};

struct ParsedUrl {
    std::string origin;
    std::string path;
    std::vector<KeyOptionalValue> parameter;
    std::vector<KeyOptionalValue> fragment;
};

class Url {
public:
    Url();
    ~Url();
    Url(std::string url);
    void set_url(std::string new_url);
    bool is_valid(std::string);
    void print_colored_url();
    void print_parsed_url(bool decode);
private:
    ParsedUrl parsed_url;
    const std::regex url_parts = std::regex(
        R"(^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$)",
        std::regex_constants::ECMAScript | std::regex_constants::icase);
    void remove_all_chars(std::string& target, char remove);
    std::vector<KeyOptionalValue> parse_key_optional_value_str(
        std::string target, std::string forbidden_chars,
        std::string delimiter);
    ParsedUrl parse_url(std::string url);
    std::string stringify_key_optional_value_vec(
        std::vector<KeyOptionalValue> kov_arr, char);
    std::string full_url();
    const std::string color_reset = "\x1b[0m";
    const std::string color_dim = "\x1b[2m";
    const std::string color_1 = "\x1b[32m";
    const std::string color_1_1 = "\x1b[92m";
    const std::string color_2 = "\x1b[35m";
    const std::string color_2_1 = "\x1b[95m";
    const std::string color_3 = "\x1b[36m";
    const std::string color_3_1 = "\x1b[96m";
    const std::string color_4 = "\x1b[34m";
    const std::string color_4_1 = "\x1b[94m";
    const std::string color_str(std::string str, std::string color);
    const std::vector<char> origin_chars = {':', '/', '.'};
    const std::vector<char> path_chars = {'/'};
    const std::vector<char> key_value_delimiters = {'='};
    const std::vector<char> key_optional_value_chars =
        {'?', '#', '&', '/', ':', '.'};
    bool is_char_in_list(std::vector<char> list, char target);
    const std::string color_chars(
        std::vector<char>, std::string target,
        std::string color_main, std::string color_aux,
        std::string color_delimiter);
    const std::string decode_uri_component(std::string uri);
    void print_key_optional_value_list(
        std::vector<KeyOptionalValue> list, bool decode,
        std::string color_main, std::string color_aux);
};
