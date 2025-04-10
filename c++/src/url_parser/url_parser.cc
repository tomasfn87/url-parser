#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

#include "url_parser.h"

Url::Url() {}

Url::~Url() {}

void Url::remove_all_chars(std::string& target, char remove) {
    auto it = std::remove(target.begin(), target.end(), remove);
    target.erase(it, target.end());
}

const void Url::parse_url() {
    std::smatch parts;
    if (std::regex_match(url, parts, url_parts)) {
        parsed_url.domain = parts[1].str();
        if (parts[2].str().size() > 0)
            parsed_url.path = parts[2].str();
        else
            parsed_url.path = "/";
        parsed_url.parameter.base_string = parts[3].str();
        parsed_url.fragment.base_string = parts[4].str();
    }
}

const void Url::parse_key_optional_value_list(
    KeyOptionalValueData& target, std::string delimiter) {
    std::smatch matchs;
    std::string::const_iterator search_start = target.base_string.cbegin();
    while (std::regex_search(
        search_start, target.base_string.cend(), matchs,
        std::regex(R"(([^?#&)" + delimiter + R"(]+(?:)"
            + delimiter + R"([^?#&)" + delimiter + R"(]+)?))"))) {
        if (matchs.size() > 0 && matchs[1].str().size() > 0) {
            target.list.push_back(matchs[1].str());
            std::smatch key_value_matchs;
            std::string key_value = matchs[1].str();
            if (std::regex_search(
                key_value.cbegin(), key_value.cend(), key_value_matchs,
                std::regex(R"(([^?#&)" + delimiter + R"(]+)(?:)"
                    + delimiter + R"(([^?#&)" + delimiter + R"(]+))?)"))) {
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

void Url::update_url() {
    remove_all_chars(url, '\\');
    parse_url();
    parse_key_optional_value_list(parsed_url.parameter, R"(=)");
    parse_key_optional_value_list(parsed_url.fragment, R"(=)");
}

Url::Url(std::string url) : url(url) {
    update_url();
}

void Url::set_url(std::string new_url) {
    url = new_url;
    update_url();
}

const std::string Url::color_str(std::string str, std::string color) {
    if (color.size() == 0)
        return str;
    std::stringstream ss;
    ss << color << str << color_reset;
    return ss.str();
}

const bool Url::is_char_in_list(std::vector<char> list, char target) {
    for (size_t i = 0; i < list.size(); ++i)
        if (list[i] == target)
            return true;
    return false;
}

const std::string Url::color_chars(
    std::vector<char> chars, std::string target,
    std::string color_main, std::string color_aux) {
    std::stringstream ss;
    int mode = 0;
    for (size_t i = 0; i < target.size(); ++i) {
        if (is_char_in_list(key_value_delimiters, target[i])) {
            if (mode != 1) {
                mode = 1;
                if (i != 0)
                    ss << color_reset;
                ss << color_1_1;
            }
        } else if (is_char_in_list(chars, target[i])) {
            if (mode != 2) {
                mode = 2;
                if (i != 0)
                    ss << color_reset;
                ss << color_main;
            }
        } else {
            if (mode != 3) {
                mode = 3;
                if (i != 0)
                    ss << color_reset;
                ss << color_aux;
            }
        }
        ss << std::string(1, target[i]);
    }
    ss << color_reset;
    return ss.str();
}

const void Url::print_colored_url() {
    std::cout 
        << color_chars(
            domain_chars, parsed_url.domain, "", color_1_1)
        << color_chars(
            path_chars, parsed_url.path, "", color_2_1)
        << color_chars(
            key_optional_value_chars, parsed_url.parameter.base_string,
            "", color_3_1)
        << color_chars(
            key_optional_value_chars, parsed_url.fragment.base_string,
            "", color_4_1) << "\n";
}

const void Url::print_key_optional_value_list(
    std::vector<KeyOptionalValue> list, std::string color_main,
    std::string color_aux) {
    for (size_t i = 0; i < list.size(); ++i) {
        if (i == 0)
            std::cout << "  " << color_str("{", color_dim) << "\n    ";
        else
            std::cout << "    ";
        if (list[i].value.size() > 0)
            std::cout << color_str(list[i].key, color_aux);
        else
            std::cout << color_str(list[i].key, color_main);
        if (list[i].value.size() > 0)
            std::cout << color_str(":", color_dim) << " "
                << color_str(list[i].value, color_main);
        if (i == (list.size() - 1))
            std::cout << "\n  " << color_str("}", color_dim) << "\n";
        else
            std::cout << color_str(",", color_dim) << "\n";
    }
}

const void Url::print_parsed_url() {
    std::cout << color_str("*", color_dim) << " "
        << color_str("Domain", color_1) << color_str(":", color_dim)
        << "    " << color_chars(
            domain_chars, parsed_url.domain, color_1_1, "") << "\n"
        << color_str("*", color_dim) << " " << color_str("Path", color_2)
        << color_str(":", color_dim) << "      "
        << color_chars(
            path_chars, parsed_url.path, color_2_1, "") << "\n";
    if (parsed_url.parameter.base_string.size() > 0) {
        std::cout << color_str("*", color_dim) << " "
            << color_str("Parameter", color_3) << color_str(":", color_dim)
            << " " << color_chars(key_optional_value_chars,
                parsed_url.parameter.base_string, color_3_1, "") << "\n";
        print_key_optional_value_list(parsed_url.parameter.map, color_3_1, color_3);
    }
    if (parsed_url.fragment.base_string.size() > 0) {
        std::cout << color_str("*", color_dim) << " "
            << color_str("Fragment", color_4) << color_str(":", color_dim)
            << "  " << color_chars(key_optional_value_chars,
                parsed_url.fragment.base_string, color_4_1, "") << "\n";
        print_key_optional_value_list(parsed_url.fragment.map, color_4_1, color_4);
    }
}
