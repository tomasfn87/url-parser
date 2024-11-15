#pragma once

#include <string>

class Url {
public:
    Url();
    Url(std::string url);
    ~Url();
    void parse_url();
private:
    std::string url;
};
