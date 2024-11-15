#include <memory>

#include "url_parser.h"

using namespace std;

int main() {
   unique_ptr<Url> url(new Url("https://github.com/tomasfn87/url-parser"));
   url->parse_url();
}
