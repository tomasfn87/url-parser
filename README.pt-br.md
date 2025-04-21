# Parse URL

## WebApp 

- Link: [`URL Parser`](https://tomasfn87.github.io/url-parser/)

## Descrição

- Divide a URL em 4 partes:
  - `Domínio`;
  - `Caminho`;
  - `Parâmetros`;
  - `Fragmento`.

- **Domínio** tenta obter o ícone do site (`favicon`) usando uma API do Google;
- **Parâmetros** e **Fragmento** são divididos em `chave` e `valor` (opcional);
- **Decodificar**: aperte o botão `Decodificar` para resolver caracteres codificados e de fato ler o conteúdo da URL.

## YouTube

- Suporta `YouTube` - para `vídeos`, `listas de reprodução` e `vídeos enviados pelo usuário`:
  - Quando uma URL do `YouTube` de **vídeo**, **lista de reprodução** ou **usuário** é detectada, um `Reprodutor da API de IFrame do YouTube` irá aparecer abaixo da tabela do resultado;
  - **Videos**, **listas de reprodução** e **vídeos enviados pelo usuário** são `automaticamente executados`;
  - **Videos**, **listas de reprodução** e **vídeos enviados pelo usuário** iniciam `mudos`.
  - Vídeo do YouTube
    - [`https://` `www.youtube.com/watch` `?v=QD5cs3R1bL4`](https://www.youtube.com/watch?v=QD5cs3R1bL4)
  - Lista de reprodução do YouTube com vídeo
    - [`https://` `www.youtube.com/watch` `?v=HvC96EaQDmU` `&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/watch?v=HvC96EaQDmU&list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - Lista de reprodução do YouTube
    - [`https://` `www.youtube.com/` `?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl`](https://www.youtube.com/?list=PLUQEQQ0Bum94su5p55Hr55R97X-SsMzQl)
  - Usuário do YouTube
    - [`https://` `www.youtube.com/` `@Google`](https://www.youtube.com/@Google)
    - :warning: nem todos as listas de vídeos enviados pelo usuário foram [carregadas](https://github.com/tomasfn87/url-parser/blob/main/index.html#L383) com sucesso; canais maiores parecem funcionar bem.
