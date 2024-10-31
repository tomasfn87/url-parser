# url-parser

Receives an URL and breaks it into `domain`, `path`, `parameters` and `fragment`.

Parameters and fragment are broken into `lists`  and `objects`.

---

<br><br>

## How to use

<br>

### User-friendly View

```console
$ node main.js 'https://docs.google.com/spreadsheets/d/1UGUlQi8P0ekbMfb8xYG-JijGqpWHRauS8rw6A-74dB4/edit?gid=864377437#gid=864377437'
```

<br>

### Struct View 

```console
$ node main.js 'https://github.com/tomasfn87/url-parser?utm_source=adpower&utm_medium=cpc&utm_campaign=ai-hype-is-a-lie' native
```
