mod url_parser;

use std::env;

fn main() {
    let args: Vec<_> = env::args().collect();
    if args.len() < 2 {
        println!("* Enter a URL to be parsed.");
        return;
    }
    let user_input = &args[1];
    let parsed_url = url_parser::Url::parse_url(user_input)
        .expect("Error parsing URL");
    parsed_url.print_url();
    println!("* Full URL:\n\t{}", parsed_url.full_url());
}