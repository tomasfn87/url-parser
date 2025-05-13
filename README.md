# URL Parser

- Algorithm to isolate the main parts and the key-value sets of a URL.

## C++

- Colorizes the URL parts and highlights characters; CLI app.

## JavaScript

- Same code used in the WebApp but organized as a class; it also includes a test class; CLI app.

## WebApp 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser/)

### Description

- [Parses](https://github.com/tomasfn87/url-parser/blob/main/index.html#L122) a URL in 4 parts:
  - `Domain`;
  - `Path`;
  - `Parameters`;
  - `Fragment`.
- **Domain** tries to [obtain](https://github.com/tomasfn87/url-parser/blob/main/index.html#L212) the site's icon (`favicon`) using a Google API;
- **Parameters** and **Fragment** are [parsed](https://github.com/tomasfn87/url-parser/blob/main/index.html#L105) into `key` and (optional) `value`;
- **Decode**: press the [`Decode`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L153) button to solve encoded characters and actually read the URL's content.

### [`YouTube`](https://www.youtube.com)

- Supports `YouTube` - for [`videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L330), [`playlists`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L301) and [`user uploaded videos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L367):
  - When a `YouTube` **video**, **playlist** or **user** URL is detected, a `YouTube IFrame API player` will appear bellow the result table;
  - **Videos**, **playlists** and **user uploaded videos** are `automatically played`;
  - **Videos**, **playlists** and **user uploaded videos** start `muted`.
  - YouTube Video
    - [`https://` `www.youtube.com/watch` `?v=QD5cs3R1bL4`](https://www.youtube.com/watch?v=QD5cs3R1bL4)
    - [`https://` `youtu.be/` `QD5cs3R1bL4`](https://youtu.be/QD5cs3R1bL4)
  - YouTube Playlist with video
    - [`https://` `www.youtube.com/watch` `?v=HvC96EaQDmU` `&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/watch?v=HvC96EaQDmU&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - YouTube Playlist
    - [`https://` `www.youtube.com/` `?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - YouTube User
    - [`https://` `www.youtube.com/` `@Google`](https://www.youtube.com/@Google)
    - :warning: not all user uploaded videos lists were sucessfully [loaded](https://github.com/tomasfn87/url-parser/blob/main/index.html#L450); bigger channels seem to work fine.

### [`Vimeo`](https://www.vimeo.com)

- [Videos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L396).

### [`Spotify`](https://www.spotify.com)

- [Tracks](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Episodes](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Shows](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Artists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Albums](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Playlists](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411);
- [Contribution](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) to Google [Tag Manager](https://tagmanager.google.com) / [Analytics](https://analytics.google.com) tracking solution for Spotify content:
  - [Documentation](https://github.com/tomasfn87/url-parser/blob/main/gtm/spotify-audio.json.md).
- Spotify URIs are accepted and converted into URLs.

## Art

- Icon Art by [@julieta_1864](https://instagram.com/julieta_1864)
