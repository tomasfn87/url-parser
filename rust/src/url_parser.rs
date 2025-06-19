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
    pub fn parse_url() {
        println!("https://site.com");
        println!("/");
        println!("?q=test");
        println!("#about");
    }

    pub fn full_url() {
        println!("https://site.com/?q=test#about");
    }
}
