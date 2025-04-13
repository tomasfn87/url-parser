# url-parser

Receives an URL and breaks it into `domain`, `path`, `parameters` and `fragment`.

Parameters and fragment are broken into `lists`  and `objects`.

---

<br><br>

## 1. How to use

<br>

### User-friendly View

```console
$ node main.js 'https://docs.google.com/spreadsheets/d/1UGUlQi8P0ekbMfb8xYG-JijGqpWHRauS8rw6A-74dB4/edit?gid=864377437#gid=864377437'
```

<br>

### Struct View 

```console
$ node main.js 'https://github.com/tomasfn87/url-parser?utm_source=adpower&utm_medium=cpc&utm_campaign=ai-hype-is-a-lie' --native
```

<br>

### Decode URL

```console
$ node main.js 'https://github.com/tomasfn87/url-parser?/redirect=%2fcontact%2femail' --decode
```

---

<br><br>

## 2. How to customize colors

- When you run `main.js` without `native` as second argument for the first time, a file named `config.json` will be created;
- This file can be edited to alter the output of the **User-friendly View**;
- If invalid options are inserted, the default color will be used instead, and an error message will appear prior to the actual output of the program to inform the user that the configuration did not work and what are the available options to choose from.

---

```json
{
  "title": "green",
  "subtitle": "blue",
  "content": "yellow"
}
```

> *Example of* `config.json` *file.*

---

<br><br>

## 3. Running Tests

### 3.1. Standard

```console
npm test
```

```console
npm run detailed-test
```

