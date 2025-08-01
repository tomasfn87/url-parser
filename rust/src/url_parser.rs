use lazy_static::lazy_static;
use regex::Regex;
use string_replace_all::string_replace_all;
use urlencoding::decode;
use ansi_term::Colour;
use ansi_term::Colour::{Cyan, Green, Purple, White, Yellow};

struct KeyOptionalValue {
    key: String,
    optional_value: Option<String>,
}

pub struct Url {
    origin: String,
    path: String,
    parameters: Vec<KeyOptionalValue>,
    fragment: Vec<KeyOptionalValue>,
}

fn print_colored_text(
    input_text: String,
    chars_to_color_1: &str,
    chars_to_color_2: &str,
    default_color: Colour,
    color_1: Colour,
    color_2: Colour,
) {
    let mut current_text = String::new();
    let mut current_color: Option<Colour> = None;
    if input_text.is_empty() {
        print!("");
        return;
    }
    for c in input_text.chars() {
        let desired_color = if chars_to_color_1.contains(c) {
            color_1
        } else if chars_to_color_2.contains(c) {
            color_2
        } else {
            default_color
        };
        if current_color.is_none() || current_color.unwrap() != desired_color {
            if !current_text.is_empty() {
                print!("{}", current_color.unwrap().paint(&current_text));
                current_text.clear();
            }
            current_color = Some(desired_color);
        }
        current_text.push(c);
    }
    print!("{}", current_color.unwrap().paint(&current_text));
}

fn parse_key_optional_value_str(
    kov_data: &str,
    forbidden_chars: &str,
    delimiter: &str,
    pair_delimiter: &str,
) -> Result<Vec<KeyOptionalValue>, String> {
    if kov_data.is_empty() {
        return Ok(Vec::<KeyOptionalValue>::new());
    }
    let escaped_forbidden_chars = regex::escape(forbidden_chars);
    let escaped_delimiter = regex::escape(delimiter);
    let escaped_pair_delimiter = regex::escape(pair_delimiter);

    let list_regex_str = format!(
        r"^([^{0}{1}{2}]+(?:{1}[^{0}{1}{2}]+)?)$",
        escaped_forbidden_chars,
        escaped_delimiter,
        escaped_pair_delimiter
    );
    let key_value_regex_str = format!(
        r"^([^{0}{1}]+)(?:{1}([^{0}{1}]+))?$",
        escaped_forbidden_chars,
        escaped_delimiter
    );
    let list_regex = Regex::new(&list_regex_str)
        .map_err(|e| format!("Invalid regex for list parsing: {}", e))?;
    let key_value_regex = Regex::new(&key_value_regex_str)
        .map_err(|e| format!("Invalid regex for key-value parsing: {}", e))?;
    let mut vector_data = Vec::new();
    for segment_str in kov_data.split(pair_delimiter) {
        if segment_str.is_empty() {
            continue;
        }
        if let Some(list_captures) = list_regex.captures(segment_str) {
            if let Some(matched_segment) = list_captures.get(1) {
                if let Some(kv_captures) = key_value_regex
                    .captures(matched_segment.as_str()) {
                    let key = kv_captures.get(1)
                        .map_or("", |m| m.as_str()).to_string();
                    let optional_value = kv_captures.get(2)
                        .map(|m| m.as_str().to_string());
                    vector_data.push(
                        KeyOptionalValue { key, optional_value });
                } else {
                    vector_data.push(KeyOptionalValue {
                        key: matched_segment.as_str().to_string(),
                        optional_value: None
                    });
                }
            }
        }
    }
    Ok(vector_data)
}

fn stringify_key_optional_value_vec(
    kov_vec: &Vec<KeyOptionalValue>,
) -> Result<String, String> {
    if kov_vec.is_empty() {
        return Ok(String::new());
    }
    let kov_data: Vec<String> = kov_vec
        .iter()
        .map(|kov| {
            if let Some(optional_value) = &kov.optional_value {
                format!("{}={}", kov.key, optional_value)
            } else {
                kov.key.to_string()
            }
        })
        .collect();
    Ok(kov_data.join("&"))
}

impl Url {
    pub fn parse_url(url_string: &str) -> Result<Url, String> {
        lazy_static! {
            static ref URL_PARTS: Regex = Regex::new(
                r"^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$"
            ).unwrap();
        }
        let clean_url_string = &string_replace_all(url_string, "\\", "");
        let captures = URL_PARTS.captures(clean_url_string)
            .ok_or_else(|| {
                format!("Failed to parse URL '{}'. It does not match the expected format.", url_string)
            })?;
        let parsed_origin = if let Some(m) = captures.get(1) {
            m.as_str().to_string()
        } else {
            return Err(format!("Could not extract origin from URL '{}'.", url_string));
        };
        let mut parsed_path = captures.get(2)
            .map_or("", |m| m.as_str())
            .to_string();
        if parsed_path.is_empty() {
            parsed_path = "/".to_string();
        }
        let parameters_data = captures.get(3)
            .map_or("", |m| m.as_str())
            .trim_start_matches('?')
            .to_string();
        let fragment_data = captures.get(4)
            .map_or("", |m| m.as_str())
            .trim_start_matches('#')
            .to_string();
        let parameters_vec = parse_key_optional_value_str(
            &parameters_data, "&=#?", "=", "&")?;
        let fragment_vec = parse_key_optional_value_str(
            &fragment_data, "&=?", "=", "&")?;
        Ok(Url {
            origin: parsed_origin,
            path: parsed_path,
            parameters: parameters_vec,
            fragment: fragment_vec,
        })
    }

    pub fn print_url(&self, decode_chars: bool) {
        print!("Origin{}", White.dimmed().paint(":\n    "));
        if decode_chars {
            print_colored_text(
                decode(&self.origin).expect("error").to_string(),
                ":/", ".", Green, Yellow, Purple);
            println!();
        } else {
            print_colored_text(self.origin.clone(), ":/", ".", Green, Yellow, Purple);
            println!();
        }
        print!("Path{}", White.dimmed().paint(":\n    "));
        if decode_chars {
            print_colored_text(
                decode(&self.path).expect("error").to_string(),
                "/", "", Green, Yellow, Yellow);
            println!();
        } else {
            print_colored_text(self.path.clone(), "/", "", Green, Yellow, Yellow);
            println!();
        }
        if !&self.parameters.is_empty() {
            let parameters =
                stringify_key_optional_value_vec(&self.parameters)
                    .expect("error").to_string();
            print!("Parameters{}", White.dimmed().paint(":\n    "));
            print!("{}", Yellow.paint("?"));
            if decode_chars {
                let decoded_parameters = 
                    decode(&parameters).expect("error").to_string();
                print_colored_text(decoded_parameters,
                    "?&", "=", Green, Yellow, Purple);
                println!();
            } else {
                print_colored_text(
                    parameters.clone(), "?&", "=", Green, Yellow, Purple);
                println!();
            }
            for param in &self.parameters {
                if let Some(ref value) = param.optional_value {
                    if decode_chars {
                        print!("  {} {}{}",
                            White.dimmed().paint("-"),
                            White.paint(decode(&param.key).expect("error").to_string()),
                            White.dimmed().paint(":"));
                        println!(" {}",
                            Yellow.paint(decode(&value).expect("error").to_string()));
                    } else {
                        print!("  {} {}{}",
                            White.dimmed().paint("-"), White.paint(&param.key),
                            White.dimmed().paint(":"));
                        println!(" {}", Yellow.paint(value));
                    }
                } else {
                    if decode_chars {
                        println!("  {} {}",
                            White.dimmed().paint("-"),
                            Green.paint(decode(&param.key).expect("error").to_string()));
                    } else {
                        println!("  {} {}",
                            White.dimmed().paint("-"), White.paint(&param.key));
                    }
                }
            }
        }
        if !&self.fragment.is_empty() {
            let fragment =
                stringify_key_optional_value_vec(&self.fragment)
                    .expect("error").to_string();
            print!("Fragment{}", White.dimmed().paint(":\n    "));
            print!("{}", Yellow.paint("#"));
            if decode_chars {
                let decoded_fragment = 
                    decode(&fragment).expect("error").to_string();
                print_colored_text(decoded_fragment,
                    "?&", "=", Green, Yellow, Purple);
                println!();
            } else {
                print_colored_text(
                    fragment.clone(), "?&", "=", Green, Yellow, Purple);
                println!();
            }
            for frag in &self.fragment {
                if let Some(ref value) = frag.optional_value {
                    if decode_chars {
                        print!("  {} {}{}",
                            White.dimmed().paint("-"),
                            White.paint(decode(&frag.key).expect("error").to_string()),
                            White.dimmed().paint(":"));
                        println!(" {}",
                            Yellow.paint(decode(&value).expect("error").to_string()));
                    } else {
                        print!("  {} {}{}",
                            White.dimmed().paint("-"), White.paint(&frag.key),
                            White.dimmed().paint(":"));
                        println!(" {}", Yellow.paint(value));
                    }
                }
            }
        }
    }

    pub fn full_url(&self) -> String {
        let mut full_url = String::new();
        full_url.push_str(&self.origin);
        full_url.push_str(&self.path);
        if !self.parameters.is_empty() {
            full_url.push_str("?");
            full_url.push_str(
                stringify_key_optional_value_vec(&self.parameters)
                    .expect("error").as_str());
        }
        if !self.fragment.is_empty() {
            full_url.push_str("#");
            full_url.push_str(
                stringify_key_optional_value_vec(&self.fragment)
                    .expect("error").as_str());
        }
        full_url
    }

    pub fn print_full_url(&self) {
        print!("Full URL{}", White.dimmed().paint(":\n    "));
        print_colored_text(
            self.full_url(), ":/?&#", ".=", Cyan, Yellow, Purple);
        println!();
    }
}