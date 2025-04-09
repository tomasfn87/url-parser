#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

#include "url_parser.h"

Url::Url() {}

Url::Url(std::string url) : url(url) {
    auto it = std::remove(url.begin(), url.end(), '\\');
    url.erase(it, url.end());
    parse_url();
    parse_key_value_list(parsed_url.parameter, R"(=)");
    parse_key_value_list(parsed_url.fragment, R"(=)");
}

Url::~Url() {}

void Url::parse_url() {
    std::smatch parts;
    if (std::regex_match(url, parts, url_parts)) {
        parsed_url.domain = parts[1].str();
        parsed_url.path = parts[2].str();
        parsed_url.parameter.base_string = parts[3].str();
        parsed_url.fragment.base_string = parts[4].str();
    }
}

void Url::parse_key_value_list(
    KeyOptionalValueData& target, std::string delimiter) {
    std::smatch matchs;
    std::string::const_iterator search_start = target.base_string.cbegin();
    while (std::regex_search(
        search_start, target.base_string.cend(), matchs,
        std::regex(
            R"(([^?#&)"
            + delimiter + R"(]+(?:)"
            + delimiter + R"([^?#&)"
            + delimiter + R"(]+)?))"))) {
        if (matchs.size() > 0 && matchs[1].str().size() > 0) {
            target.list.push_back(matchs[1].str());
            std::smatch key_value_matchs;
            std::string key_value = matchs[1].str();
            if (std::regex_search(
                key_value.cbegin(), key_value.cend(), key_value_matchs,
                std::regex(
                    R"(([^?#&)"
                    + delimiter + R"(]+)(?:)"
                    + delimiter + R"(([^?#&)"
                    + delimiter + R"(]+))?)"))) {
                KeyOptionalValue kov;
                kov.key = key_value_matchs[1].str();
                if (key_value_matchs.size() > 2) {
                    kov.value = key_value_matchs[2].str();
                }
                target.map.push_back(kov);
            }
        }
        search_start = matchs.suffix().first;
    }
}

std::string Url::color_str(std::string str, std::string color) {
    std::stringstream ss;
    ss << color << str << color_reset;
    return ss.str();
}

void Url::print_colored_url() {
    std::cout << color_str(parsed_url.domain, color_1)
        << color_str(parsed_url.path, color_2)
        << color_str(parsed_url.parameter.base_string, color_3)
        << color_str(parsed_url.fragment.base_string, color_4) << "\n";
}

void Url::print_key_optional_value_list(
    std::vector<KeyOptionalValue> list, std::string color) {
    for (size_t i = 0; i < list.size(); ++i) {
        if (i == 0)
            std::cout << "  " << color_str("{", color_dim) << "\n    ";
        else
            std::cout << "    ";
        std::cout << color_str(list[i].key, color);
        if (list[i].value.size() > 0)
            std::cout << color_str(":", color_dim) << " " << list[i].value;
        if (i == (list.size() - 1))
            std::cout << "\n  " << color_str("}", color_dim) << "\n";
        else
            std::cout << color_str(",", color_dim) << "\n";
    }
}

void Url::print_parsed_url() {
    std::cout << color_str("*", color_dim) << " "
        << color_str("Domain", color_1)
        << color_str(":", color_dim) << "    "
        << parsed_url.domain << "\n"
        << color_str("*", color_dim) << " "
        << color_str("Path", color_2)
        << color_str(":", color_dim) << "      "
        << parsed_url.path << "\n";
    if (parsed_url.parameter.base_string.size() > 0)
        std::cout << color_str("*", color_dim) << " "
            << color_str("Parameter", color_3) << color_str(":", color_dim)
            << " " << parsed_url.parameter.base_string << "\n";
    print_key_optional_value_list(parsed_url.parameter.map, color_3_1);
    if (parsed_url.fragment.base_string.size() > 0)
        std::cout << color_str("*", color_dim) << " "
            << color_str("Fragment", color_4) << color_str(":", color_dim)
            << "  " << parsed_url.fragment.base_string << "\n";
    print_key_optional_value_list(parsed_url.fragment.map, color_4_1);
}
