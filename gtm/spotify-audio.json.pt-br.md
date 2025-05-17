# Tag de Áudio do [`Spotify`](https://www.spotify.com) para `Google Tag Manager`

## Descrição

- **Tag HTML Personalizado** para [***Google Tag Manager***](https://tagmanager.google.com) que é capaz de detectar qual conteúdo está sendo executado e até que ponto ocorreu a execução, sob a forma de valores inteiros entre 1 and 99 (em porcentagens) e sob a forma de valores reais (em segundos);
- Nenhuma informação humanamente amigável está disponível *(nenhum nome de **episódio**, **faixa**, **artista**, **álbum**, **lista de reprodução** ou **show** será capturada, ainda que talvez seja possível por **Raspagem de DOM**)*:
- Cada conteúdo é identificado por uma [`URI do Spotify`](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids), que consiste em três partes:
  - `{plataforma}` **:** `{tipo de conteúdo}` **:** `{identificador}`;
  - ***Exemplos:***
    - `spotify` **:** `album` **:** `7Ff0Q5oeEoVKHtxJJoXyId`;
    - `spotify` **:** `artist` **:** `1on7ZQ2pvgeQF4vmIA09x5`;
    - `spotify` **:** `episode` **:** `5DVGuabuaHaC9UxQodcyvf`;
    - `spotify` **:** `playlist` **:** `0E6htK22DGE5d4jj3r6dmS`.
  - Diferentes ***faixas*** executadas dentro de uma ***lista de reprodução*** são identificadas apenas pela **duração**:
    - Isso nos permite contar quantas **faixas** foram executadas (*parcial or completamente*) dentro de um conteúdo agrupado (*lista de reprodução, artista ou álbum*).
 - **URLs de Show** (*i.e. [`open.spotify.com/show/3bdzILat9px7eH27ziXl8K`](https://open.spotify.com/show/3bdzILat9px7eH27ziXl8K)*) redirecionam para o último episódio do show;

---

## Eventos Implementados

- `audio_playback_started`;
- `audio_playback_paused`;
- `audio_playback_resumed`;
- `audio_complete`;
- `audio_progress`:
  - ***Valores detectados de porcentagem*** são **configurados** e **validados** na `Tag HTML Personalizado do Spotify` (i.e. `[ 25, 50, 75 ]`).

---

## Parâmetros da Tag

- `audio_content`;
- `audio_content_type`;
- `audio_current_time`;
- `audio_duration`;
- `audio_percent`;
- `audio_provider`;
- `audio_status`.

---

## Função `JavaScript` para converter ***URI*** do **Spotify** em ***URL***

- Qualquer URI pode ser transformada em um link [`open.spotify.com`](https://open.spotify.com) seguindo o **modelo** abaixo:
   - **`URI`**:
     - `spotify` **:** `album` **:** `7Ff0Q5oeEoVKHtxJJoXyId`.
   - **`URL`**:
     - `https://open.spotify.com` **/** `album` **/** `7Ff0Q5oeEoVKHtxJJoXyId`.

```javascript
(function obterUrlSpotifyDeUri(uri) {
    var erUriSpotify = /spotify:([^:]+):([^:]+)/i;
    var resultado = { uri_spotify: uri, url_spotify: '' };
    if (erUriSpotify.test(uri)) {
        var correspondencias = erUriSpotify.exec(uri);
        var tipoConteudo = correspondencias[1];
        var idConteudo = correspondencias[2];
        resultado.url_spotify = 'https://open.spotify.com/'+tipoConteudo+'/'+idConteudo;
    }
    return resultado;
})(
    'spotify:album:7Ff0Q5oeEoVKHtxJJoXyId'
);
```

### Saída Esperada

```javascript
{
    uri_spotify: 'spotify:album:7Ff0Q5oeEoVKHtxJJoXyId',
    url_spotify: 'https://open.spotify.com/album/7Ff0Q5oeEoVKHtxJJoXyId'
}
```

---

## Pré-Configuração: IFrame do Reprodutor Spotify

```html
<iframe src="https://open.spotify.com/embed/track/3qN5qMTKyEEmiTZD38CmPA" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
<script>
// Envia uma mensagem para o reprodutor do Spotify para que saiba nosso domínio
var reprodutorSpotify = document.querySelector('iframe[src^="https://open.spotify.com"]');
reprodutorSpotify.contentWindow.postMessage({
    type: 'listeningOn',
    domain: window.location.hostname,
    gtmId: 'SEU-ID-CONTEINER-GTM'
}, 'https://open.spotify.com');
</script>
```

---

## Tag HTML Personalizado de Spotify Audio para [Google Tag Manager](https://tagmanager.google.com)

> Para maiores detalhes de implementação, favor visitar o [tópico da Comunidade do Spotify](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) onde esta implementação foi desenvolvida e publicada.

```html
<script>
// - A operação abaixo é necessária para garantir que a
// a lista de porcentagens a serem detectadas como eventos
// de progresso  siga o formato correto.
var spotifyPercentagesToBeDetected = (function(arr) {
  var truncatedList = arr.filter(function(element) {
    return typeof element === 'number';
  }).map(function(element) {
    return Math.trunc(element);
  }).filter(function(element) {
    return element > 0 && element < 100;
  });
  var uniqueValuesObject = {};
  for (var i = 0; i < truncatedList.length; i++) {
    uniqueValuesObject[truncatedList[i]] = true;
  }
  var uniqueList = Object.keys(uniqueValuesObject).map(function(key) {
    return parseInt(key, 10);
  });
  uniqueList.sort(function(a, b) {
    return a - b;
  });
  return uniqueList;
})(
  // - Edite a lista abaixo para configurar os valores de porcentagem dos eventos de progresso:
  [99, 20, 10.5, 60, 100, 40.05, 80, 90, 30, 50, 70, 0, 99.3, "no"]
  // (Esperada: lista de valores inteiros únicos de 1 a 99, ordenados em ordem crescente)
);
// A lista é certamente [10, 20, 30, 40, 50, 60, 70, 80, 90, 99] uma vez processada.

// - Checa se um valor calculado de porcentagem deve ser detectado ou não.
function shouldPercentageBeDetected(percent, detectionList) {
  for (var i = 0; i < detectionList.length; i++) {
    if (percent >= detectionList[i] && !(detectionList[i+1] && detectionList[i+1] <= percent)) {
      return { check: true, value: detectionList[i] };
    }
  }
  return { check: false, value: undefined };
}

var spotifyWasPaused = false;
var spotifyAudioCompleted = false;
var spotifyRegisteredProgress = [];
var spotifyLastDuration = 0.0;
var spotifyLastURI = '';
window.addEventListener('message', function(event) {
  if (event.origin === 'https://open.spotify.com') {
    var audioPercent = Math.trunc((event.data.payload.position / event.data.payload.duration) * 100) || 0;
    var audioCurrentTime = (event.data.payload.position / 1000) || 0;
    var audioDuration = (event.data.payload.duration / 1000) || 0;
    var spotifyURI = event.data.payload.playingURI;
    var reSpotifyUri = /spotify:([^:]+):([^:]+)/i;
    var audioData = (function(uri) {
      if (reSpotifyUri.test(uri)) {
        var p = reSpotifyUri.exec(uri);
        return {
          contentType: p[1],
          url: 'https://open.spotify.com/'+p[1]+'/'+p[2]
        };
      }
    })(spotifyURI);
    var spotifyEvent = {
      event: 'spotifyEvent',
      audioPercent: audioPercent,
      audioCurrentTime: audioCurrentTime,
      audioDuration: audioDuration,
      audioContentType: audioData.contentType,
      audioUrl: audioData.url,
      spotifyURI: spotifyURI
    }
    // - Reiniciar as Variáveis de Controle de Reprodução caso a URI ou a Duração
    // tenham sido alteradas (detecção da troca de faixas dentro de lista de reprodução, álbum ou artista).
    if ((spotifyURI && spotifyURI !== spotifyLastURI) || (spotifyURI && spotifyURI === spotifyLastURI && spotifyLastDuration !== audioDuration && spotifyLastDuration && audioDuration && Math.round(spotifyLastDuration) !== Math.round(audioDuration))) {
      spotifyAudioCompleted = false;
      spotifyWasPaused = false;
      spotifyRegisteredProgress = [];
    }
    // 1. Eventos de Progresso
    if (spotifyURI && shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).check) {
      if (!spotifyRegisteredProgress.includes(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value)) {
        spotifyRegisteredProgress.push(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value);
        spotifyEvent.audioStatus = 'progress';
        spotifyEvent.audioPercent = shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value;
        dataLayer.push(spotifyEvent);
        spotifyLastURI = spotifyURI;
        if (audioDuration) spotifyLastDuration = audioDuration;
      }
    }
    // 2. Atualizações de Reprodução
    // 2.1. Reprodução Iniciada
    if (spotifyURI && event.data.type === 'playback_started') {
      spotifyEvent.audioStatus = 'playback_started';
      dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
    // 2.2. Reprodução Pausada
    } else if (spotifyURI && event.data.type === 'playback_update' && event.data.payload.isPaused && audioCurrentTime && !spotifyWasPaused) {
      spotifyEvent.audioStatus = 'playback_paused';
      dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      if (audioDuration) spotifyLastDuration = audioDuration;
      spotifyWasPaused = true;
    // 2.3. Reprodução Retomada
    } else if (spotifyURI && event.data.type === 'playback_update' && !event.data.payload.isPaused && spotifyWasPaused && event.data.payload.position) {
      spotifyEvent.audioStatus = 'playback_resumed';
      dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      if (audioDuration) spotifyLastDuration = audioDuration;
      spotifyWasPaused = false;
    // 2.4. Completo
    } else if (spotifyURI && event.data.type === 'playback_update' && audioDuration === audioCurrentTime && !spotifyAudioCompleted) {
      spotifyEvent.audioStatus = 'complete';
      spotifyEvent.audioPercent = 100;
      dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      if (audioDuration) spotifyLastDuration = audioDuration;
      spotifyAudioCompleted = true;
    }
  }
}, false);
</script>
```

---

## Importando **Tags**, **Acionadores** and **Variáveis** no `Google Tag Manager`

- Salve o `JSON` abaixo em um arquivo e **importe-o** no [*Google Tag Manager*](https://tagmanager.google.com):
  - [`Admin`](https://tagmanager.google.com/#/admin) > `Importar Contêiner`.
- Adicione uma constante chamada `{{GA4 - Datastream Measurement ID}}` com seu **ID de Propriedade do [Google Analytics 4](https://analytics.google.com)**.

### Arquivo `JSON` de Contêiner Exportado do Google Tag Manager

```json
{
    "exportFormatVersion": 2,
    "exportTime": "2025-05-18 15:18:26",
    "containerVersion": {
        "path": "accounts/6054360526/containers/218106977/versions/0",
        "accountId": "6054360526",
        "containerId": "218106977",
        "containerVersionId": "0",
        "container": {
            "path": "accounts/6054360526/containers/218106977",
            "accountId": "6054360526",
            "containerId": "218106977",
            "name": "URL Parser",
            "publicId": "GTM-MXNVD4PJ",
            "usageContext": [
                "WEB"
            ],
            "fingerprint": "1745068856375",
            "tagManagerUrl": "https://tagmanager.google.com/#/container/accounts/6054360526/containers/218106977/workspaces?apiLink=container",
            "features": {
                "supportUserPermissions": true,
                "supportEnvironments": true,
                "supportWorkspaces": true,
                "supportGtagConfigs": false,
                "supportBuiltInVariables": true,
                "supportClients": false,
                "supportFolders": true,
                "supportTags": true,
                "supportTemplates": true,
                "supportTriggers": true,
                "supportVariables": true,
                "supportVersions": true,
                "supportZones": true,
                "supportTransformations": false
            },
            "tagIds": [
                "GTM-MXNVD4PJ"
            ]
        },
        "tag": [
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "4",
                "name": "Google Tag",
                "type": "googtag",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "tagId",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1745079335876",
                "firingTriggerId": [
                    "2147479573"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "ONCE_PER_EVENT",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "8",
                "name": "GA4 - Mouse generate_lead",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "cta_label"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Click Text}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input_domain"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input Domain}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "interaction_type"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "click"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "generate_lead"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1746889346708",
                "firingTriggerId": [
                    "7"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "UNLIMITED",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "13",
                "name": "GA4 - YouTube video",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_duration"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Duration}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_percent"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Percent}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_title"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Title}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_url"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video URL}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_current_time"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Current Time}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_provider"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Provider}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_status"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Video Status}}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "video_{{Video Status}}"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1746245324106",
                "firingTriggerId": [
                    "12"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "UNLIMITED",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "22",
                "name": "GA4 - link_click",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "click_url"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{Click URL}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input_domain"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input Domain}}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "link_click"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1746894434700",
                "firingTriggerId": [
                    "21"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "UNLIMITED",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "23",
                "name": "cHTML - Vimeo video",
                "type": "html",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "html",
                        "value": "<script src=\"https://player.vimeo.com/api/player.js\"></script>\n<script>\n\n(function() {\n\tvar videoProgress = [10, 20, 30, 40, 50, 60, 70, 80, 90, 99];\n\tfunction handlePlayer(player) {\n    \tvar triggeredSteps = {};\n    \tvar video_title = '';\n    \tvar video_url = '';\n    \tvar isStarted = false;\n    \tvar upperRange = 2;\n\n    \tplayer.getVideoTitle().then(function(title) {\n        \tvideo_title = title;\n    \t});\n\n    \tplayer.getVideoUrl().then(function(url) {\n        \tvideo_url = url;\n    \t});\n\n    \tplayer.on('play', function(data) {\n\n        \tif (!isStarted) {\n            \tif(data.duration < 30) {\n                \tupperRange = 6;\n            \t}\n\n            \twindow.dataLayer = window.dataLayer || [];\n            \tdataLayer.push({\n                \tevent: 'Vimeo Video',\n                \tvideo_status: 'start',\n                \tvideo_current_time: 0,\n                \tvideo_duration: data.duration,\n                \tvideo_percent: 0,\n                \tvideo_provider: 'Vimeo',\n                \tvideo_title: video_title,\n                \tvideo_url: video_url\n            \t})\n            \tisStarted = true;\n        \t}\n    \t});\n\n    \tplayer.on('ended', function(data) {\n        \twindow.dataLayer = window.dataLayer || [];\n        \tdataLayer.push({\n            \tevent: 'Vimeo Video',\n            \tvideo_status: 'complete',\n            \tvideo_current_time: data.seconds,\n            \tvideo_duration: data.duration,\n            \tvideo_percent: 100,\n            \tvideo_provider: 'Vimeo',\n            \tvideo_title: video_title,\n            \tvideo_url: video_url\n        \t});\n    \t});\n\n    \tplayer.on('timeupdate', function(data) {\n        \tvar actualPercent = data.percent * 100;\n\n        \tvideoProgress.forEach(function(targetPercent) {\n            \tif (\n                \t!triggeredSteps[targetPercent] &&\n                \tactualPercent >= targetPercent &&\n                \tactualPercent <= targetPercent + upperRange\n            \t) {\n                \twindow.dataLayer = window.dataLayer || [];\n                \tdataLayer.push({\n                    \tevent: 'Vimeo Video',\n                    \tvideo_status: 'progress',\n                    \tvideo_current_time: data.seconds,\n                    \tvideo_duration: data.duration,\n                    \tvideo_percent: targetPercent,\n                    \tvideo_provider: 'Vimeo',\n                    \tvideo_title: video_title,\n                    \tvideo_url: video_url\n                \t});\n                \ttriggeredSteps[targetPercent] = true;\n            \t}\n        \t});\n    \t});\n\t}\n\n\tfunction findVimeoPlayer(node) {\n    \tif (node.tagName === 'IFRAME' && node.src.includes('player.vimeo.com/video')) {\n        \tvar player = new Vimeo.Player(node);\n        \thandlePlayer(player);\n    \t} else {\n        \tvar iframes = node.querySelectorAll('iframe');\n        \tiframes.forEach(function(iframe) {\n            \tif (iframe.src.includes('player.vimeo.com/video')) {\n                \tvar player = new Vimeo.Player(iframe);\n                \thandlePlayer(player);\n            \t}\n        \t});\n    \t}\n\t}\n\n\tvar observer = new MutationObserver(function(mutationsList) {\n    \tmutationsList.forEach(function(mutation) {\n        \tif (mutation.type === 'childList') {\n            \tmutation.addedNodes.forEach(function(node) {\n                \tfindVimeoPlayer(node);\n            \t});\n        \t}\n    \t});\n\t});\n\n\tobserver.observe(document.body, { childList: true, subtree: true });\n\n\n\tvar existingPlayers = document.querySelectorAll('iframe[src^=\"https://player.vimeo.com/video\"]');\n\texistingPlayers.forEach(function(playerNode) {\n    \thandlePlayer(new Vimeo.Player(playerNode));\n\t});\n})();\n</script>"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "supportDocumentWrite",
                        "value": "false"
                    }
                ],
                "fingerprint": "1746373504271",
                "firingTriggerId": [
                    "2147479553"
                ],
                "parentFolderId": "33",
                "tagFiringOption": "ONCE_PER_EVENT",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "32",
                "name": "GA4 - Vimeo video",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_current_time"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_current_time}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_duration"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_duration}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_percent"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_percent}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_provider"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_provider}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_status"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_status}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_title"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_title}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "video_url"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - video_url}}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "video_{{DLV - video_status}}"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1746796646322",
                "firingTriggerId": [
                    "31"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "UNLIMITED",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "38",
                "name": "GA4 - Spotify audio",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_provider"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "Spotify"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_content"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - spotifyURI}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_status"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioStatus}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_percent"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioPercent}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_duration"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioDuration}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_current_time"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioCurrentTime}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_content_type"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioContentType}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "audio_url"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - audioUrl}}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "audio_{{DLV - audioStatus}}"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1747188193405",
                "firingTriggerId": [
                    "40"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "ONCE_PER_EVENT",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "39",
                "name": "cHTML - Spotify audio",
                "type": "html",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "html",
                        "value": "<script>\n// - The operation below is needed to assure the list of\n// percentages to be detected as progress events follow\n// the correct format.\nvar spotifyPercentagesToBeDetected = (function(arr) {\n  var truncatedList = arr.filter(function(element) {\n    return typeof element === 'number';\n  }).map(function(element) {\n    return Math.trunc(element);\n  }).filter(function(element) {\n    return element > 0 && element < 100;\n  });\n  var uniqueValuesObject = {};\n  for (var i = 0; i < truncatedList.length; i++) {\n    uniqueValuesObject[truncatedList[i]] = true;\n  }\n  var uniqueList = Object.keys(uniqueValuesObject).map(function(key) {\n    return parseInt(key, 10);\n  });\n  uniqueList.sort(function(a, b) {\n    return a - b;\n  });\n  return uniqueList;\n})(\n  // - Edit the list below to setup progress events' percentage values:\n  [99, 20, 10.5, 60, 100, 40.05, 80, 90, 30, 50, 70, 0, 99.3, \"no\"]\n  // (Expected: list with unique integer values ranging from 1 to 99, sorted in ascending order)\n);\n// List is certainly [10, 20, 30, 40, 50, 60, 70, 80, 90, 99] after being processed.\n\n// - Check if a calculated percentage value should or not be detected.\nfunction shouldPercentageBeDetected(percent, detectionList) {\n  for (var i = 0; i < detectionList.length; i++) {\n    if (percent >= detectionList[i] && !(detectionList[i+1] && detectionList[i+1] <= percent)) {\n      return { check: true, value: detectionList[i] };\n    }\n  }\n  return { check: false, value: undefined };\n}\n\nvar spotifyWasPaused = false;\nvar spotifyAudioCompleted = false;\nvar spotifyRegisteredProgress = [];\nvar spotifyLastDuration = 0.0;\nvar spotifyLastURI = '';\nwindow.addEventListener('message', function(event) {\n  if (event.origin === 'https://open.spotify.com') {\n    var audioPercent = Math.trunc((event.data.payload.position / event.data.payload.duration) * 100) || 0;\n    var audioCurrentTime = (event.data.payload.position / 1000) || 0;\n    var audioDuration = (event.data.payload.duration / 1000) || 0;\n    var spotifyURI = event.data.payload.playingURI;\n    var reSpotifyUri = /spotify:([^:]+):([^:]+)/i;\n    var audioData = (function(uri) {\n      if (reSpotifyUri.test(uri)) {\n        var p = reSpotifyUri.exec(uri);\n        return {\n          contentType: p[1],\n          url: 'https://open.spotify.com/'+p[1]+'/'+p[2]\n        };\n      }\n    })(spotifyURI);\n    var spotifyEvent = {\n      event: 'spotifyEvent',\n      audioPercent: audioPercent,\n      audioCurrentTime: audioCurrentTime,\n      audioDuration: audioDuration,\n      audioContentType: audioData.contentType,\n      audioUrl: audioData.url,\n      spotifyURI: spotifyURI\n    }\n    // - Restart Playback Control Variables in case URI ou Duration has\n    // changed (track change detection within playlist, album or artist).\n    if ((spotifyURI && spotifyURI !== spotifyLastURI) || (spotifyURI && spotifyURI === spotifyLastURI && spotifyLastDuration !== audioDuration && spotifyLastDuration && audioDuration && Math.round(spotifyLastDuration) !== Math.round(audioDuration))) {\n      spotifyAudioCompleted = false;\n      spotifyWasPaused = false;\n      spotifyRegisteredProgress = [];\n    }\n    // 1. Progress Events\n    if (spotifyURI && shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).check) {\n      if (!spotifyRegisteredProgress.includes(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value)) {\n        spotifyRegisteredProgress.push(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value);\n        spotifyEvent.audioStatus = 'progress';\n        spotifyEvent.audioPercent = shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value;\n        dataLayer.push(spotifyEvent);\n        spotifyLastURI = spotifyURI;\n        if (audioDuration) spotifyLastDuration = audioDuration;\n      }\n    }\n    // 2. Playback updates\n    // 2.1. Playback Start\n    if (spotifyURI && event.data.type === 'playback_started') {\n      spotifyEvent.audioStatus = 'playback_started';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n    // 2.2. Playback Paused\n    } else if (spotifyURI && event.data.type === 'playback_update' && event.data.payload.isPaused && audioCurrentTime && !spotifyWasPaused) {\n      spotifyEvent.audioStatus = 'playback_paused';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyWasPaused = true;\n    // 2.3. Playback Resumed\n    } else if (spotifyURI && event.data.type === 'playback_update' && !event.data.payload.isPaused && spotifyWasPaused && event.data.payload.position) {\n      spotifyEvent.audioStatus = 'playback_resumed';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyWasPaused = false;\n    // 2.4. Complete\n    } else if (spotifyURI && event.data.type === 'playback_update' && audioDuration === audioCurrentTime && !spotifyAudioCompleted) {\n      spotifyEvent.audioStatus = 'complete';\n      spotifyEvent.audioPercent = 100;\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyAudioCompleted = true;\n    }\n  }\n}, false);\n</script>"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "supportDocumentWrite",
                        "value": "false"
                    }
                ],
                "fingerprint": "1747194787383",
                "firingTriggerId": [
                    "2147479553"
                ],
                "parentFolderId": "36",
                "tagFiringOption": "ONCE_PER_EVENT",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "52",
                "name": "cHTML - Keyboard generate_lead",
                "type": "html",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "html",
                        "value": "<script>\nvar urlInput = document.getElementById('urlInput');\nurlInput.addEventListener('keydown', function(event) {\n  dataLayer = window.dataLayer || [];\n  var isUrlValid = !document.getElementById('parseButton').matches('button[disabled]');\n  if (event.key === 'Enter' && isUrlValid) dataLayer.push({\n      event: 'keyboardGenerateLead',\n      interactionType: 'keyboard',\n      ctaLabel: 'Parse'});\n});\n</script>"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "supportDocumentWrite",
                        "value": "false"
                    }
                ],
                "fingerprint": "1746891283325",
                "firingTriggerId": [
                    "2147479553"
                ],
                "parentFolderId": "15",
                "tagFiringOption": "ONCE_PER_EVENT",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "tagId": "53",
                "name": "GA4 - Keyboard generate_lead",
                "type": "gaawe",
                "parameter": [
                    {
                        "type": "BOOLEAN",
                        "key": "sendEcommerceData",
                        "value": "false"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "enhancedUserId",
                        "value": "false"
                    },
                    {
                        "type": "LIST",
                        "key": "eventSettingsTable",
                        "list": [
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "cta_label"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - ctaLabel}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "url_input_domain"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{CJS - URL Input Domain}}"
                                    }
                                ]
                            },
                            {
                                "type": "MAP",
                                "map": [
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameter",
                                        "value": "interaction_type"
                                    },
                                    {
                                        "type": "TEMPLATE",
                                        "key": "parameterValue",
                                        "value": "{{DLV - interactionType}}"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "eventName",
                        "value": "generate_lead"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "measurementIdOverride",
                        "value": "{{GA4 - Datastream Measurement ID}}"
                    }
                ],
                "fingerprint": "1746889617434",
                "firingTriggerId": [
                    "54"
                ],
                "parentFolderId": "14",
                "tagFiringOption": "UNLIMITED",
                "monitoringMetadata": {
                    "type": "MAP"
                },
                "consentSettings": {
                    "consentStatus": "NOT_SET"
                }
            }
        ],
        "trigger": [
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "7",
                "name": "[click] CTA - Parse/Decode Buttons",
                "type": "CLICK",
                "filter": [
                    {
                        "type": "MATCH_REGEX",
                        "parameter": [
                            {
                                "type": "TEMPLATE",
                                "key": "arg0",
                                "value": "{{Click ID}}"
                            },
                            {
                                "type": "TEMPLATE",
                                "key": "arg1",
                                "value": "(pars|decod)eButton"
                            }
                        ]
                    },
                    {
                        "type": "EQUALS",
                        "parameter": [
                            {
                                "type": "TEMPLATE",
                                "key": "arg0",
                                "value": "{{CJS - validateURL}}"
                            },
                            {
                                "type": "TEMPLATE",
                                "key": "arg1",
                                "value": "true"
                            }
                        ]
                    }
                ],
                "fingerprint": "1746891051461",
                "parentFolderId": "15"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "12",
                "name": "[video] YouTube Video",
                "type": "YOU_TUBE_VIDEO",
                "fingerprint": "1745903158535",
                "parentFolderId": "11",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "progressThresholdsPercent",
                        "value": "10,20,30,40,50,60,70,80,90,99"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "captureComplete",
                        "value": "true"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "captureStart",
                        "value": "true"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "fixMissingApi",
                        "value": "true"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "triggerStartOption",
                        "value": "WINDOW_LOAD"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "radioButtonGroup1",
                        "value": "PERCENTAGE"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "capturePause",
                        "value": "true"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "captureProgress",
                        "value": "true"
                    }
                ]
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "21",
                "name": "[link click] All Links",
                "type": "LINK_CLICK",
                "waitForTags": {
                    "type": "BOOLEAN",
                    "value": "false"
                },
                "checkValidation": {
                    "type": "BOOLEAN",
                    "value": "false"
                },
                "waitForTagsTimeout": {
                    "type": "TEMPLATE",
                    "value": "2000"
                },
                "uniqueTriggerId": {
                    "type": "TEMPLATE"
                },
                "fingerprint": "1745903123032",
                "parentFolderId": "15"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "31",
                "name": "[video] Vimeo Video",
                "type": "CUSTOM_EVENT",
                "customEventFilter": [
                    {
                        "type": "EQUALS",
                        "parameter": [
                            {
                                "type": "TEMPLATE",
                                "key": "arg0",
                                "value": "{{_event}}"
                            },
                            {
                                "type": "TEMPLATE",
                                "key": "arg1",
                                "value": "Vimeo Video"
                            }
                        ]
                    }
                ],
                "fingerprint": "1746252804951",
                "parentFolderId": "33"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "40",
                "name": "[audio] Spotify Event",
                "type": "CUSTOM_EVENT",
                "customEventFilter": [
                    {
                        "type": "EQUALS",
                        "parameter": [
                            {
                                "type": "TEMPLATE",
                                "key": "arg0",
                                "value": "{{_event}}"
                            },
                            {
                                "type": "TEMPLATE",
                                "key": "arg1",
                                "value": "spotifyEvent"
                            }
                        ]
                    }
                ],
                "fingerprint": "1746701993548",
                "parentFolderId": "36"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "triggerId": "54",
                "name": "DLV - keyboardGenerateLead",
                "type": "CUSTOM_EVENT",
                "customEventFilter": [
                    {
                        "type": "EQUALS",
                        "parameter": [
                            {
                                "type": "TEMPLATE",
                                "key": "arg0",
                                "value": "{{_event}}"
                            },
                            {
                                "type": "TEMPLATE",
                                "key": "arg1",
                                "value": "keyboardGenerateLead"
                            }
                        ]
                    }
                ],
                "fingerprint": "1746889460624",
                "parentFolderId": "15"
            }
        ],
        "variable": [
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "3",
                "name": "GA4 - Datastream Measurement ID",
                "type": "c",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "value",
                        "value": "G-BCE843QBRV"
                    }
                ],
                "fingerprint": "1747580098962",
                "parentFolderId": "14",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "9",
                "name": "CJS - URL Input Domain",
                "type": "jsm",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "javascript",
                        "value": "function() {\n  var regexURL = /^(?:\\w+:\\/\\/)?([^\\/.:]+(?:\\.[^\\/.:?#]+)+)((?:\\/?(?:[^\\/?#]+)?)*)?(\\?[^?]+?)?(#[^#]+?)?$/;\n  var regexSpotifyUri = /spotify:(album|artist|episode|playlist|show|track):([^ \\/?&#=]+)/i;\n  var urlInput = {{CJS - URL Input}};\n  var urlInputDomain = '';\n  // To correctly handle Spotify URIs\n  if (regexSpotifyUri.test(urlInput))\n    urlInput = urlInput.replace(/^spotify/i, 'open.spotify.com').replace(/:/g, '/');\n  if (regexURL.test(urlInput)) {\n    var matches = regexURL.exec(urlInput);\n    urlInputDomain = matches[1];\n  };\n  return urlInputDomain;\n}"
                    }
                ],
                "fingerprint": "1747060338228",
                "parentFolderId": "15",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "10",
                "name": "CJS - URL Input",
                "type": "jsm",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "javascript",
                        "value": "function() {\n  return document.getElementById('urlInput').valueOf().value\n}"
                    }
                ],
                "fingerprint": "1746889975354",
                "parentFolderId": "15",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "24",
                "name": "DLV - video_status",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_status"
                    }
                ],
                "fingerprint": "1746245506096",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "25",
                "name": "DLV - video_current_time",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_current_time"
                    }
                ],
                "fingerprint": "1746245506096",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "26",
                "name": "DLV - video_duration",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_duration"
                    }
                ],
                "fingerprint": "1746245506096",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "27",
                "name": "DLV - video_percent",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_percent"
                    }
                ],
                "fingerprint": "1746245506097",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "28",
                "name": "DLV - video_provider",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_provider"
                    }
                ],
                "fingerprint": "1746245506097",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "29",
                "name": "DLV - video_title",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_title"
                    }
                ],
                "fingerprint": "1746245506097",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "30",
                "name": "DLV - video_url",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "video_url"
                    }
                ],
                "fingerprint": "1746245506097",
                "parentFolderId": "33",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "43",
                "name": "DLV - spotifyURI",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "spotifyURI"
                    }
                ],
                "fingerprint": "1746552618628",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "45",
                "name": "DLV - audioStatus",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioStatus"
                    }
                ],
                "fingerprint": "1746540487283",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "46",
                "name": "DLV - audioPercent",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioPercent"
                    }
                ],
                "fingerprint": "1746541029734",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "49",
                "name": "DLV - audioCurrentTime",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioCurrentTime"
                    }
                ],
                "fingerprint": "1746566004340",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "50",
                "name": "DLV - audioDuration",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioDuration"
                    }
                ],
                "fingerprint": "1746566023960",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "55",
                "name": "DLV - interactionType",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "interactionType"
                    }
                ],
                "fingerprint": "1746889505817",
                "parentFolderId": "15",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "56",
                "name": "DLV - ctaLabel",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "ctaLabel"
                    }
                ],
                "fingerprint": "1746889527190",
                "parentFolderId": "15",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "57",
                "name": "CJS - validateURL",
                "type": "jsm",
                "parameter": [
                    {
                        "type": "TEMPLATE",
                        "key": "javascript",
                        "value": "function() {\n  return !document.getElementById('parseButton').matches('button[disabled]');\n}"
                    }
                ],
                "fingerprint": "1746914835399",
                "parentFolderId": "15",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "59",
                "name": "DLV - audioContentType",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioContentType"
                    }
                ],
                "fingerprint": "1747102190814",
                "parentFolderId": "36",
                "formatValue": {}
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "variableId": "60",
                "name": "DLV - audioUrl",
                "type": "v",
                "parameter": [
                    {
                        "type": "INTEGER",
                        "key": "dataLayerVersion",
                        "value": "2"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "setDefaultValue",
                        "value": "false"
                    },
                    {
                        "type": "TEMPLATE",
                        "key": "name",
                        "value": "audioUrl"
                    }
                ],
                "fingerprint": "1747188009921",
                "parentFolderId": "36",
                "formatValue": {}
            }
        ],
        "folder": [
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "folderId": "11",
                "name": "YouTube",
                "fingerprint": "1745077953958"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "folderId": "14",
                "name": "GA4",
                "fingerprint": "1745079323841"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "folderId": "15",
                "name": "CTA",
                "fingerprint": "1745080192866"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "folderId": "33",
                "name": "Vimeo",
                "fingerprint": "1746245503554"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "folderId": "36",
                "name": "Spotify",
                "fingerprint": "1746252451511"
            }
        ],
        "builtInVariable": [
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "PAGE_URL",
                "name": "Page URL"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "PAGE_HOSTNAME",
                "name": "Page Hostname"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "PAGE_PATH",
                "name": "Page Path"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "REFERRER",
                "name": "Referrer"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "EVENT",
                "name": "Event"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "CLICK_ELEMENT",
                "name": "Click Element"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "CLICK_ID",
                "name": "Click ID"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "CLICK_URL",
                "name": "Click URL"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "CLICK_TEXT",
                "name": "Click Text"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_PROVIDER",
                "name": "Video Provider"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_URL",
                "name": "Video URL"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_TITLE",
                "name": "Video Title"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_DURATION",
                "name": "Video Duration"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_PERCENT",
                "name": "Video Percent"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_STATUS",
                "name": "Video Status"
            },
            {
                "accountId": "6054360526",
                "containerId": "218106977",
                "type": "VIDEO_CURRENT_TIME",
                "name": "Video Current Time"
            }
        ],
        "fingerprint": "1747581506918",
        "tagManagerUrl": "https://tagmanager.google.com/#/versions/accounts/6054360526/containers/218106977/versions/0?apiLink=version"
    }
}
```
