mod url_parser;

fn main() {
    url_parser::Url::parse_url();
    println!();
    url_parser::Url::full_url();
}
