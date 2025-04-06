#include <memory>
#include <iostream>

#include "url_parser.h"

using namespace std;

int main(int argc, char* argv[]) {
   string input;
   if (argc > 1)
        input = argv[1];
   if (input == "--demo") {
      std::string u1 = "https://github.com/tomasfn87/calcular-digitos-verificar-cpf/blob/main/c/cpf.c#L2";
      unique_ptr<Url> url_1(new Url(u1));
      ParsedUrl parsed_url_1 = url_1->parse_url();
      
      std::cout << "\n";
      std::string u2 = "https://docs.google.com/spreadsheets/d/187ytpeZenV7T7bRUIS3My60616Sjr6S-dzYXxPlDvr4/edit?pli=1&gid=0#gid=0";
      unique_ptr<Url> url_2(new Url(u2));
      ParsedUrl parsed_url_2 = url_2->parse_url();
      
      std::cout << "\n";
      std::string u3 = "https://supersite.com/test?gclid=123123129dashdh123h7da&lang=EN-US#C=1&P=22&dark-mode";
      unique_ptr<Url> url_3(new Url(u3));
      ParsedUrl parsed_url_3 = url_3->parse_url();
   } else {
      unique_ptr<Url> url(new Url(input));
      ParsedUrl parsed_url = url->parse_url();
   }
}
