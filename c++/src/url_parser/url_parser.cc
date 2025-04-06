#include <iostream>
#include <regex>
#include <string>
#include <vector>

#include "url_parser.h"

Url::Url() {}

Url::Url(std::string url) : url(url) {
    auto it = std::remove(this->url.begin(), this->url.end(), '\\');
    this->url.erase(it, this->url.end());
}

Url::~Url() {}

ParsedUrl Url::parse_url() {
    std::smatch parts;
    ParsedUrl parsed_url;
    if (std::regex_match(url, parts, this->url_parts)) {
        parsed_url.domain = parts[1].str();
        parsed_url.path = parts[2].str();
        parsed_url.parameter.base_string = parts[3].str();
        parsed_url.fragment.base_string = parts[4].str();
    }
    std::cout << "\x1b[95m" << parsed_url.domain << "\x1b[0m";
    std::cout << "\x1b[33m" << parsed_url.path << "\x1b[0m";
    std::cout << "\x1b[36m" << parsed_url.parameter.base_string << "\x1b[0m";
    std::cout << "\x1b[34m" << parsed_url.fragment.base_string
        << "\x1b[0m" << "\n";
    /*
     * Domain
     */
    std::cout << "\x1b[2m*\x1b[0m \x1b[95m" << "Domain"
        <<"\x1b[0m\x1b[2m:\x1b[0m    "
        << parsed_url.domain << "\n";
    /*
     * Path
     */
    std::cout << "\x1b[2m*\x1b[0m \x1b[33m" << "Path"
        << "\x1b[0m\x1b[2m:\x1b[0m      "
        << parsed_url.path << "\n";
    /*
     * Parameter
     */
    std::smatch parameter;
    if (parsed_url.parameter.base_string.size() > 0)
        std::cout
            << "\x1b[2m*\x1b[0m \x1b[36m" << "Parameter"
            << "\x1b[0m\x1b[2m:\x1b[0m "
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
    for (size_t i = 0; i < parsed_url.parameter.parameter_map.size(); ++i) {
        if (i == 0)
            std::cout << "  \x1b[2m{\x1b[0m\n    ";
        else
            std::cout << "    ";
        std::cout << "\x1b[96m" << parsed_url.parameter.parameter_map[i].key
            << "\x1b[0m" << "\x1b[2m:\x1b[0m "
            << parsed_url.parameter.parameter_map[i].value;
        if (i == (parsed_url.parameter.parameter_map.size() - 1))
            std::cout << "\n  \x1b[2m}\x1b[0m\n";
        else
            std::cout << "\x1b[2m,\x1b[0m\n";
    }
    /*
     * Fragment
     */
    std::smatch fragment;
    if (parsed_url.fragment.base_string.size() > 0)
        std::cout
            << "\x1b[2m*\x1b[0m \x1b[34m" << "Fragment"
            << "\x1b[0m\x1b[2m:\x1b[0m  "
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
    for (size_t i = 0; i < parsed_url.fragment.fragment_map.size(); ++i) {
        if (i == 0)
            std::cout << "  \x1b[2m{\x1b[0m\n    ";
        else
            std::cout << "    ";
        std::cout << "\x1b[94m" << parsed_url.fragment.fragment_map[i].key
            << "\x1b[0m";
        if (parsed_url.fragment.fragment_map[i].value.size() > 0)
            std::cout << "\x1b[2m:\x1b[0m "
                << parsed_url.fragment.fragment_map[i].value;
        if (i == (parsed_url.fragment.fragment_map.size() - 1))
            std::cout << "\n  \x1b[2m}\x1b[0m\n";
        else
            std::cout << "\x1b[2m,\x1b[0m\n";
    }
    return parsed_url;
}
