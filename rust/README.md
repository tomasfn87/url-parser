# `url-parser`

## Requirements

- `cargo`
- `rustc`

---

<br>

## Commands

### Building

```console
cargo -q build
```

### Executing

#### Parse URL

```console
./target/debug/url_parser https://mysite.com/video?time=123s
```

```console
./target/debug/url_parser https://mysite.com/?redirect=%2fcontact%2femail --decode
```

