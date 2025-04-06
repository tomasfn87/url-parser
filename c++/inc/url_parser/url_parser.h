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
    ParsedUrl parse_url();
private:
    std::string url;
    std::regex url_parts = std::regex(
        R"(^((?:\w+:\/\/)?[^\/]+\.[^\/]+)((?:\/[^\/?#]*)*)(\?\S*?)?(#\S*)?$)",
        std::regex_constants::ECMAScript | std::regex_constants::icase
    );
};
