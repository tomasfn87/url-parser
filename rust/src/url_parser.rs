use lazy_static::lazy_static;
use regex::Regex;

// Todo: parameters and fragment string decoding
// use urlencoding::decode; 

struct KeyOptionalValue {
    key: String,
    optional_value: Option<String>,
}

struct KeyOptionalValueData {
    data: String,
    #[allow(dead_code)]
    list: Vec<String>,
    obj: Vec<KeyOptionalValue>,
}

pub struct Url {
    origin: String,
    path: String,
    parameters: KeyOptionalValueData,
    fragment: KeyOptionalValueData,
}

impl KeyOptionalValueData {
    pub fn parse_key_optional_value(
        kov_data: &str,
        forbidden_chars: &str,
        delimiter: &str,
        pair_delimiter: &str,
    ) -> Result<KeyOptionalValueData, String> {
        if kov_data.is_empty() {
            return Ok(KeyOptionalValueData {
                data: kov_data.to_string(),
                list: Vec::new(),
                obj: Vec::new(),
            });
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

        let mut list_data = Vec::new();
        let mut obj_data = Vec::new();

        for segment_str in kov_data.split(pair_delimiter) {
            if segment_str.is_empty() {
                continue;
            }
            if let Some(list_captures) = list_regex.captures(segment_str) {
                if let Some(matched_segment) = list_captures.get(1) {
                    list_data.push(matched_segment.as_str().to_string());
                    if let Some(kv_captures) = key_value_regex.captures(matched_segment.as_str()) {
                        let key = kv_captures.get(1).map_or("", |m| m.as_str()).to_string();
                        let optional_value = kv_captures.get(2).map(|m| m.as_str().to_string());
                        obj_data.push(KeyOptionalValue { key, optional_value });
                    } else {
                        obj_data.push(KeyOptionalValue { key: matched_segment.as_str().to_string(), optional_value: None });
                    }
                }
            } else {
                obj_data.push(KeyOptionalValue { key: segment_str.to_string(), optional_value: None });
            }
        }

        Ok(KeyOptionalValueData {
            data: kov_data.to_string(),
            list: list_data,
            obj: obj_data,
        })
    }
}

impl Url {
    pub fn parse_url(url_string: &str) -> Result<Url, String> {
        lazy_static! {
            static ref URL_PARTS: Regex = Regex::new(
                r"^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$"
            ).unwrap();
        }
        let captures = URL_PARTS.captures(url_string)
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
        let parameters_data = KeyOptionalValueData::parse_key_optional_value(
            &parameters_data, "&=#?", "=", "&")?;
        let fragment_data = KeyOptionalValueData::parse_key_optional_value(
            &fragment_data, "&=?", "=", "&")?;
        
        Ok(Url {
            origin: parsed_origin,
            path: parsed_path,
            parameters: parameters_data,
            fragment: fragment_data,
        })
    }

    pub fn print_url(&self) {
        println!("* Origin:\n\t{}", &self.origin);
        println!("* Path:\n\t{}", &self.path);
        if !&self.parameters.data.is_empty() {
            println!("* Parameters:\n\t{}", &self.parameters.data);
            for param in &self.parameters.obj {
                if let Some(ref value) = param.optional_value {
                    println!("    - {}: {}", param.key, value);
                } else {
                    println!("    - {}", param.key);
                }
            }
        }
        if !&self.fragment.data.is_empty() {
            println!("* Fragment:\n\t{}", &self.fragment.data);
            for frag in &self.fragment.obj {
                if let Some(ref value) = frag.optional_value {
                    println!("    - {}: {}", frag.key, value);
                } else {
                    println!("    - {}", frag.key);
                }
            }
        }
    }

    pub fn full_url(&self) -> String {
        let mut full_url_string = String::new();
        full_url_string.push_str(&self.origin);
        full_url_string.push_str(&self.path);
        if !self.parameters.data.is_empty() {
            full_url_string.push('?');
            full_url_string.push_str(&self.parameters.data);
        }
        if !self.fragment.data.is_empty() {
            full_url_string.push('#');
            full_url_string.push_str(&self.fragment.data);
        }
        full_url_string
    }
}