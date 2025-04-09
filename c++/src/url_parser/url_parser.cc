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

std::string Url::color_str(std::string str, std::string color) {
    std::stringstream ss;
    ss << color << str << color_reset;
    return ss.str();
}

void Url::print_colored_url() {
    std::cout << color_str(parsed_url.domain, color_1);
    std::cout << color_str(parsed_url.path, color_2);
    std::cout << color_str(parsed_url.parameter.base_string, color_3);
    std::cout << color_str(parsed_url.fragment.base_string, color_4);
}

void Url::print_key_optional_value_list(
    std::vector<KeyOptionalValue> l, std::string color) {
    for (size_t i = 0; i < l.size(); ++i) {
        if (i == 0)
            std::cout << "  " << color_str("{", color_dim) << "\n    ";
        else
            std::cout << "    ";
        std::cout << color_str(l[i].key, color);
        if (l[i].value.size() > 0)
            std::cout << color_str(":", color_dim) << " " << l[i].value;
        if (i == (l.size() - 1))
            std::cout << "\n  " << color_str("}", color_dim) << "\n";
        else
            std::cout << color_str(",", color_dim) << "\n";
    }
}

void Url::print_parsed_url() {
    std::cout << "\n";
    /*
     * Domain
     */
    std::cout << color_str("*", color_dim) << " "
        << color_str("Domain", color_1)
        << color_str(":", color_dim) << "    "
        << parsed_url.domain << "\n";
    /*
     * Path
     */
    std::cout << color_str("*", color_dim) << " "
        << color_str("Path", color_2)
        << color_str(":", color_dim) << "      "
        << parsed_url.path << "\n";
    /*
     * Parameter
     */
    std::smatch parameter;
    if (parsed_url.parameter.base_string.size() > 0)
        std::cout
            << color_str("*", color_dim) << " "
            << color_str("Parameter", color_3)
            << color_str(":", color_dim) << " "
            << parsed_url.parameter.base_string << "\n";
    std::string::const_iterator parameter_search_start =
        parsed_url.parameter.base_string.cbegin();
    while (std::regex_search(
        parameter_search_start,
        parsed_url.parameter.base_string.cend(),
        parameter, std::regex(R"(([^?#&=]+(?:=[^?#&=]+)))"))) {
        if (parameter.size() > 0) {
            if (parameter[1].str().size() > 0) {
                parsed_url.parameter.parameter_list.push_back(
                    parameter[1].str());
                std::smatch key_value;
                std::string p = parameter[1].str();
                if (std::regex_search(
                    p.cbegin(), p.cend(), key_value,
                    std::regex(R"(([^?#&=]+)(?:=([^?#&=]+)))"))) {
                    KeyOptionalValue kov;
                    kov.key = key_value[1].str();
                    kov.value = key_value[2].str();
                    parsed_url.parameter.parameter_map.push_back(kov);
                }
            }
        }
        parameter_search_start = parameter.suffix().first;
    }
    print_key_optional_value_list(
        parsed_url.parameter.parameter_map, color_3_1);
    /*
     * Fragment
     */
    std::smatch fragment;
    if (parsed_url.fragment.base_string.size() > 0)
        std::cout
            << color_str("*", color_dim) << " "
            << color_str("Fragment", color_4)
            << color_str(":", color_dim) << "  "
            << parsed_url.fragment.base_string << "\n";
    std::string::const_iterator fragment_search_start =
        parsed_url.fragment.base_string.cbegin();
    while (std::regex_search(fragment_search_start,
        parsed_url.fragment.base_string.cend(),
        fragment, std::regex(R"(([^?#&=]+(?:=[^?#&=]+)?))"))) {
        if (fragment.size() > 0) {
            if (fragment[1].str().size() > 0) {
                parsed_url.fragment.fragment_list.push_back(
                    fragment[1].str());
                std::smatch key_value;
                std::string f = fragment[1].str();
                if (std::regex_search(f.cbegin(), f.cend(), key_value,
                    std::regex(R"(([^?#&=]+)(?:=([^?#&=]+))?)"))) {
                    KeyOptionalValue kov;
                    kov.key = key_value[1].str();
                    if (key_value.size() > 2) {
                        kov.value = key_value[2].str();
                    }
                    parsed_url.fragment.fragment_map.push_back(kov);
                }
            }
        }
        fragment_search_start = fragment.suffix().first;
    }
    print_key_optional_value_list(
        parsed_url.fragment.fragment_map, color_4_1);
}
