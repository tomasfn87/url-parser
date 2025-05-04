# Analisador de URL

- Algoritmo para isolar as partes principais e os conjuntos chave-valor de uma URL.

## C++

- Colorifica as partes da URL e destaca caracteres; app de ILC (CLI).

## JavaScript

- Mesmo código usado no WebApp porém organizado como uma classe; também inclui uma classe de testes; app de ILC (CLI).

## WebApp 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser/)

### Descrição

- [Divide](https://github.com/tomasfn87/url-parser/blob/main/index.html#L121) a URL em 4 partes:
  - `Domínio`;
  - `Caminho`;
  - `Parâmetros`;
  - `Fragmento`.
- **Domínio** tenta [obter](https://github.com/tomasfn87/url-parser/blob/main/index.html#L203) o ícone do site (`favicon`) usando uma API do Google;
- **Parâmetros** e **Fragmento** são [divididos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L104) em `chave` e `valor` (opcional);
- **Decodificar**: aperte o botão [`Decodificar`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L152) para resolver caracteres codificados e de fato ler o conteúdo da URL.

### [`YouTube`](https://www.youtube.com)

- Suporta `YouTube` - para [`vídeos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L321), [`listas de reprodução`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L292) e [`vídeos enviados pelo usuário`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L358):
  - Quando uma URL do `YouTube` de **vídeo**, **lista de reprodução** ou **usuário** é detectada, um `Reprodutor da API de IFrame do YouTube` irá aparecer abaixo da tabela do resultado;
  - **Videos**, **listas de reprodução** e **vídeos enviados pelo usuário** são `automaticamente executados`;
  - **Videos**, **listas de reprodução** e **vídeos enviados pelo usuário** iniciam `mudos`.
  - Vídeo do YouTube
    - [`https://` `www.youtube.com/watch` `?v=QD5cs3R1bL4`](https://www.youtube.com/watch?v=QD5cs3R1bL4)
    - [`https://` `youtu.be/` `QD5cs3R1bL4`](https://youtu.be/QD5cs3R1bL4)
  - Lista de reprodução do YouTube com vídeo
    - [`https://` `www.youtube.com/watch` `?v=HvC96EaQDmU` `&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/watch?v=HvC96EaQDmU&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - Lista de reprodução do YouTube
    - [`https://` `www.youtube.com/` `?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - Usuário do YouTube
    - [`https://` `www.youtube.com/` `@Google`](https://www.youtube.com/@Google)
    - :warning: nem todas as listas de vídeos enviados pelo usuário foram [carregadas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L441) com sucesso; canais maiores parecem funcionar bem.

### [`Vimeo`](https://www.vimeo.com)

- [Vídeos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L387).

### [`Spotify`](https://www.spotify.com)

- [Faixas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L402);
- [Episódios](https://github.com/tomasfn87/url-parser/blob/main/index.html#L402);
- [Artistas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L402);
- [Álbuns](https://github.com/tomasfn87/url-parser/blob/main/index.html#L402);
- [Listas de reprodução](https://github.com/tomasfn87/url-parser/blob/main/index.html#L402);
- [Contribuição](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) to Google [Tag Manager](https://tagmanager.google.com) / [Analytics](https://analytics.google.com) com a solução de tracking para conteúdo do Spotify.

## Arte

- Arte do Ícone por [@julieta_1864](https://instagram.com/julieta_1864)
