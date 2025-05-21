# URL Parser

- Algorithm to isolate the main parts and the key-value sets of a URL.

## C++

- Colorizes the URL parts and highlights characters; CLI app.

## JavaScript

- Same code used in the WebApp but organized as a class; it also includes a test class; CLI app.

## Web App 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser/)

### Description

- [Parses](https://github.com/tomasfn87/url-parser/blob/main/index.html#L42) a URL in 4 parts:
  - `Domain`;
  - `Path`;
  - `Parameters`;
  - `Fragment`.
- **Domain** tries to [obtain](https://github.com/tomasfn87/url-parser/blob/main/index.html#L218) the site's icon (`favicon`) using a Google API;
- **Parameters** and **Fragment** are [parsed](https://github.com/tomasfn87/url-parser/blob/main/index.html#L25) into `key` and (optional) `value`;
- **Decode**: press the [`Decode`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L161) button to solve encoded characters and actually read the URL's content.

### Media Players supported

#### [`YouTube`](https://www.youtube.com)

- [`Videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L344);
- [`Playlists`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L311;)
- [`Lives`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L385);
- [`User uploaded videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411).

#### [`Vimeo`](https://www.vimeo.com)

- [Videos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L444).

#### [`Spotify`](https://www.spotify.com)

- [Tracks](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- [Episodes](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- [Shows](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- [Artists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- [Albums](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- [Playlists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L465);
- Spotify URIs are accepted and converted into URLs.

#### Spotify Audio Tag for Google Tag Manager

- [Contribution](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) to Google [Tag Manager](https://tagmanager.google.com) / [Analytics](https://analytics.google.com) tracking solution for Spotify content:
  - [Documentation](https://github.com/tomasfn87/url-parser/blob/main/gtm/spotify-audio.json.md);
  - Visit this project's [Web App](https://tomasfn87.github.io/url-parser?spotifycontent=artist:1nJvji2KIlWSseXRSlNYsC), open the console (`F12`) and type `dataLayer` to see the tag working (a Spotify content will already be loaded).

## Art

- Icon Art by [@julieta_1864](https://instagram.com/julieta_1864)
