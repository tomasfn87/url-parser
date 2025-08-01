# URL Parser

- Algorithm to isolate the main parts and the key-value sets of a URL.

## C++ / Rust

- Colorizes the URL parts and highlights characters; CLI app.

## JavaScript

- Same code used in the WebApp but organized as a class; it also includes a test class; CLI app.

## Web App 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser?utm_source=github&utm_medium=readme)

### Description

- [Parses](https://github.com/tomasfn87/url-parser/blob/main/index.html#L58) a URL in 4 parts:
  - `Origin`;
  - `Path`;
  - `Parameters`;
  - `Fragment`.
- **Origin** tries to [obtain](https://github.com/tomasfn87/url-parser/blob/main/index.html#L242) the site's icon (`favicon`) using a Google API;
- **Parameters** and **Fragment** are [parsed](https://github.com/tomasfn87/url-parser/blob/main/index.html#L25) into `key` and (optional) `value`;
- **Decode**: press the [`Decode`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L185) button to solve encoded characters and actually read the URL's content.

### Media Players supported

#### [`YouTube`](https://www.youtube.com)

- [`Videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L372);
- [`Playlists`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L339;)
- [`Lives`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L413);
- [`User uploaded videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439).

#### [`Vimeo`](https://www.vimeo.com)

- [Videos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L472).

#### [`Spotify`](https://www.spotify.com)

- [Tracks](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- [Episodes](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- [Shows](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- [Artists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- [Albums](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- [Playlists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L493);
- Spotify URIs are accepted and converted into URLs.

#### Spotify Audio Tag for Google Tag Manager

- [Contribution](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) to Google [Tag Manager](https://tagmanager.google.com) / [Analytics](https://analytics.google.com) tracking solution for Spotify content:
  - [Documentation](https://github.com/tomasfn87/url-parser/blob/main/gtm/spotify-audio.json.md);
  - Visit this project's [Web App](https://tomasfn87.github.io/url-parser?spotifycontent=artist:1nJvji2KIlWSseXRSlNYsC&utm_source=github&utm_medium=readme), open the console (`F12`) and type `dataLayer` to see the tag working (a Spotify content will already be loaded).

## Art

- Icon Art by [@julieta_1864](https://instagram.com/julieta_1864)
