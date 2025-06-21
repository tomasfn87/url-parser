use lazy_static::lazy_static;
use regex::Regex;

struct KeyOptionalValue {
    key: String,
    optional_value: Option<String>,
}

struct KeyOptionalValueData {
    data: String,
    list: Vec<String>,
    obj: Vec<KeyOptionalValue>,
}

pub struct Url {
    origin: String,
    path: String,
    parameters: KeyOptionalValueData,
    fragment: KeyOptionalValueData,
}

impl Url {
    pub fn parse_url(url: &str) -> Result<Url, String> {
        lazy_static! {
            static ref URL_PARTS: Regex = Regex::new(
                r"^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$"
            ).unwrap();
        }
        let captures = URL_PARTS.captures(url)
            .ok_or_else(|| {
                format!("Failed to parse URL '{}'. It does not match the expected format.", url)
            })?;

        let parsed_origin = if let Some(m) = captures.get(1) {
            m.as_str().to_string()
        } else {
            return Err(format!("Could not extract origin from URL '{}'.", url));
        };

        let mut parsed_path = captures.get(2)
                                      .map_or("", |m| m.as_str())
                                      .to_string();
        if parsed_path.is_empty() {
            parsed_path = "/".to_string();
        }

        let parsed_parameters_data = captures.get(3)
                                             .map_or("", |m| m.as_str())
                                             .to_string();

        let parsed_fragment_data = captures.get(4)
                                           .map_or("", |m| m.as_str())
                                           .to_string();

        println!("* Origin:     {}", parsed_origin);
        println!("* Path:       {}", parsed_path);
        println!("* Parameters: {}", parsed_parameters_data);
        println!("* Fragment:   {}", parsed_fragment_data);
        
        Ok(Url {
            origin: parsed_origin,
            path: parsed_path,
            parameters: KeyOptionalValueData {
                data: parsed_parameters_data,
                list: Vec::new(),
                obj: Vec::new(),
            },
            fragment: KeyOptionalValueData {
                data: parsed_fragment_data,
                list: Vec::new(),
                obj: Vec::new(),
            },
        })
    }

    pub fn full_url(&self) -> String {
        let mut full_url_string = String::new();
        full_url_string.push_str(&self.origin);
        full_url_string.push_str(&self.path);

        if !self.parameters.data.is_empty() {
            full_url_string.push_str(&self.parameters.data);
        }

        if !self.fragment.data.is_empty() {
            full_url_string.push_str(&self.fragment.data);
        }

        full_url_string
    }
}
