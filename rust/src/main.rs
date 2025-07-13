mod url_parser;

use ansi_term::Colour::Red;
use std::env;

fn main() {
    let args: Vec<_> = env::args().collect();
    if args.len() < 2 {
        println!("{}: {}", Red.paint("ERROR"), "empty URL. Insert a URL and try again.");
        return;
    }
    let user_input = &args[1];
    if let Ok(parsed_url) = url_parser::Url::parse_url(user_input) {
        parsed_url.print_url(args.len() > 2 && &args[2] == "--decode");
        parsed_url.print_full_url();
    } else {
        println!("{}: {}", Red.paint("ERROR"), "invalid URL. Insert a valid URL and try again.");
    }
}