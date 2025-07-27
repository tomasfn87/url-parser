# Analisador de URL

- Algoritmo para isolar as partes principais e os conjuntos chave-valor de uma URL.

## C++ / Rust

- Colorifica as partes da URL e destaca caracteres; app de ILC (CLI).

## JavaScript

- Mesmo código usado no WebApp porém organizado como uma classe; também inclui uma classe de testes; app de ILC (CLI).

## Aplicação Web 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser?utm_source=github&utm_medium=readme-br)

### Descrição

- [Divide](https://github.com/tomasfn87/url-parser/blob/main/index.html#L42) a URL em 4 partes:
  - `Origem`;
  - `Caminho`;
  - `Parâmetros`;
  - `Fragmento`.
- **Origem** tenta [obter](https://github.com/tomasfn87/url-parser/blob/main/index.html#L218) o ícone do site (`favicon`) usando uma API do Google;
- **Parâmetros** e **Fragmento** são [divididos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L25) em `chave` e `valor` (opcional);
- **Decodificar**: aperte o botão [`Decodificar`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L161) para resolver caracteres codificados e de fato ler o conteúdo da URL.

### Reprodutores de Mídia suportados

#### [`YouTube`](https://www.youtube.com)

- [`Vídeos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L344);
- [`Listas de reprodução`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L311;)
- [`Ao vivo`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L385);
- [`Vídeos enviados pelo usuário`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L411).

#### [`Vimeo`](https://www.vimeo.com)

- [Vídeos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L418).

#### [`Spotify`](https://www.spotify.com)

- [Faixas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- [Episódios](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- [Shows](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- [Artistas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- [Álbuns](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- [Listas de reprodução](https://github.com/tomasfn87/url-parser/blob/main/index.html#L439);
- URIs do Spotify são aceitas e convertidas em URLs.

#### Tag Áudio do Spotify para Google Tag Manager

- [Contribuição](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) com a solução de tracking para Google [Tag Manager](https://tagmanager.google.com) / [Analytics](https://analytics.google.com) para conteúdo do Spotify:
  - [Documentação](https://github.com/tomasfn87/url-parser/blob/main/gtm/spotify-audio.json.pt-br.md);
  - Visite a [Aplicação Web](https://tomasfn87.github.io/url-parser?spotifycontent=artist:1nJvji2KIlWSseXRSlNYsC&utm_source=github&utm_medium=readme-br) deste projeto, abra o console (`F12`) e digite `dataLayer` para ver a tag funcionado (um conteúdo Spotify já será automaticamente carregado).

## Arte

- Arte do Ícone por [@julieta_1864](https://instagram.com/julieta_1864)
