# Analisador de URL

- Algoritmo para isolar as partes principais e os conjuntos chave-valor de uma URL.

## C++

- Colorifica as partes da URL e destaca caracteres; app de ILC (CLI).

## JavaScript

- Mesmo código usado no WebApp porém organizado como uma classe; também inclui uma classe de testes; app de ILC (CLI).

## WebApp 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser/)

### Descrição

- [Divide](https://github.com/tomasfn87/url-parser/blob/main/index.html#L92) a URL em 4 partes:
  - `Domínio`;
  - `Caminho`;
  - `Parâmetros`;
  - `Fragmento`.
- **Domínio** tenta [obter](https://github.com/tomasfn87/url-parser/blob/main/index.html#L174) o ícone do site (`favicon`) usando uma API do Google;
- **Parâmetros** e **Fragmento** são [divididos](https://github.com/tomasfn87/url-parser/blob/main/index.html#L75) em `chave` e `valor` (opcional);
- **Decodificar**: aperte o botão [`Decodificar`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L123) para resolver caracteres codificados e de fato ler o conteúdo da URL.

### YouTube

- Suporta `YouTube` - para [`vídeos`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L293), [`listas de reprodução`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L264) e [`vídeos enviados pelo usuário`](https://github.com/tomasfn87/url-parser/blob/main/index.html#L330):
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
    - :warning: nem todas as listas de vídeos enviados pelo usuário foram [carregadas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L376) com sucesso; canais maiores parecem funcionar bem.
