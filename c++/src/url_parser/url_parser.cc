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

void Url::parse_key_optional_value_list(
    KeyOptionalValueData& target, std::string delimiter) {
    std::smatch matchs;
    std::string::const_iterator search_start = target.base_string.cbegin();
    while (std::regex_search(
        search_start, target.base_string.cend(), matchs,
        std::regex(R"(([^?#&)" + delimiter + R"(]+(?:)"
            + delimiter + R"([^?#&)" + delimiter + R"(]+)?))"))) {
        if (matchs.size() && matchs[1].str().size()) {
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

bool Url::is_valid() {
    return std::regex_match(url, url_parts);
}

void Url::parse_url() {
    std::smatch parts;
    if (std::regex_match(url, parts, url_parts)) {
        parsed_url.domain = parts[1].str();
        if (parts[2].str().size())
            parsed_url.path = parts[2].str();
        else
            parsed_url.path = "/";
        parsed_url.parameter.base_string = parts[3].str();
        parsed_url.fragment.base_string = parts[4].str();
    }
    parse_key_optional_value_list(parsed_url.parameter, R"(=)");
    parse_key_optional_value_list(parsed_url.fragment, R"(=)");
}

void Url::update_url() {
    remove_all_chars(url, '\\');
    parse_url();
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
    std::string color_main, std::string color_aux,
    std::string color_delimiter) {
    std::stringstream ss;
    std::string color_block;
    std::string previous_color;
    for (size_t i = 0; i < target.size(); ++i) {
        if (is_char_in_list(key_value_delimiters, target[i])) {
            if (previous_color != color_delimiter) {
                if (color_block.size()) {
                    ss << color_str(color_block, previous_color);
                    color_block = "";
                }
                previous_color = color_delimiter;
            }   
        } else if (is_char_in_list(chars, target[i])) {
            if (previous_color != color_main) {
                if (color_block.size()) {
                    ss << color_str(color_block, previous_color);
                    color_block = "";
                }
                previous_color = color_main;
            }
        } else {
            if (previous_color != color_aux) {
                if (color_block.size()) {
                    ss << color_str(color_block, previous_color);
                    color_block = "";
                }
                previous_color = color_aux;
            }
        }
        color_block += std::string(1, target[i]);
    }
    ss << color_str(color_block, previous_color);
    return ss.str();
}

const void Url::print_colored_url(bool decode) {
    std::string d = parsed_url.domain;
    std::string p = parsed_url.path;
    std::string q = parsed_url.parameter.base_string;
    std::string f = parsed_url.fragment.base_string;
    if (decode) {
        d = decode_uri_component(d);
        p = decode_uri_component(p);
        q = decode_uri_component(q);
        f = decode_uri_component(f);
    }
    std::cout
        << color_chars(domain_chars, d, "", color_1_1, "")
        << color_chars(path_chars, p, "", color_2_1, "")
        << color_chars(
            key_optional_value_chars, q, "", color_3_1, color_dim)
        << color_chars(
            key_optional_value_chars, f, "", color_4_1, color_dim) << "\n";
}

const std::string Url::decode_uri_component(std::string uri) {
    std::string decoded = "";
    for (size_t i = 0; i < uri.length(); ++i) {
        if (uri[i] == '%' && i + 2 < uri.length() && std::isxdigit(uri[i + 1])
            && std::isxdigit(uri[i + 2])) {
            std::string hex_str = uri.substr(i + 1, 2);
            try {
                int char_code = std::stoi(hex_str, nullptr, 16);
                decoded += static_cast<char>(char_code);
                i += 2;
            } catch (const std::invalid_argument& e) {
                decoded += uri[i];
            } catch (const std::out_of_range& e) {
                decoded += uri[i];
            }
        } else {
            decoded += uri[i];
        }
    }
    return decoded;
}

const void Url::print_key_optional_value_list(
    std::vector<KeyOptionalValue> list, bool decode,
    std::string color_main, std::string color_aux) {
    for (size_t i = 0; i < list.size(); ++i) {
        if (i == 0)
            std::cout << "  " << color_str("{", color_dim) << "\n    ";
        else
            std::cout << "    ";
        if (list[i].value.size())
            std::cout << color_str(list[i].key, color_aux);
        else
            std::cout << color_str(list[i].key, color_main);
        if (list[i].value.size()) {
            std::cout << color_str(":", color_dim) << " ";
            if (decode)
                std::cout << color_str(
                    decode_uri_component(list[i].value), color_main);
            else
                std::cout << color_str(list[i].value, color_main);
        }
        if (i == (list.size() - 1))
            std::cout << "\n  " << color_str("}", color_dim) << "\n";
        else
            std::cout << color_str(",", color_dim) << "\n";
    }
}

const void Url::print_parsed_url(bool decode) {
    std::string d = parsed_url.domain;
    std::string p = parsed_url.path;
    std::string q = parsed_url.parameter.base_string;
    std::string f = parsed_url.fragment.base_string;
    if (decode) {
        d = decode_uri_component(d);
        p = decode_uri_component(p);
        q = decode_uri_component(q);
        f = decode_uri_component(f);
    }
    std::cout << color_str("→", color_dim) << " "
        << color_str("Domain", color_1) << color_str(":", color_dim)
        << "    " << color_chars(domain_chars, d, color_1_1, "", "") << "\n"
        << color_str("→", color_dim) << " " << color_str("Path", color_2)
        << color_str(":", color_dim) << "      "
        << color_chars(path_chars, p, color_2_1, "", "") << "\n";
    if (parsed_url.parameter.base_string.size()) {
        std::cout << color_str("→", color_dim) << " "
            << color_str("Parameter", color_3) << color_str(":", color_dim)
            << " " << color_chars(key_optional_value_chars, q, 
                color_3_1, "", color_3) << "\n";
        print_key_optional_value_list(parsed_url.parameter.map, decode, color_3_1, color_3);
    }
    if (parsed_url.fragment.base_string.size()) {
        std::cout << color_str("→", color_dim) << " "
            << color_str("Fragment", color_4) << color_str(":", color_dim)
            << "  " << color_chars(key_optional_value_chars, f,
                color_4_1, "", color_4) << "\n";
        print_key_optional_value_list(parsed_url.fragment.map, decode, color_4_1, color_4);
    }
}
