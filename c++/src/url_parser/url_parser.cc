#include <iostream>
#include <string>

#include "url_parser.h"

Url::Url() {}

Url::Url(std::string url) : url(url) {}

Url::~Url() {}

void Url::parse_url() {
    std::cout << url << std::endl;
}
