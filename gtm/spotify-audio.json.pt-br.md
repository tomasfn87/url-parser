# Tag de Áudio do [`Spotify`](https://www.spotify.com) para `Google Tag Manager`

## Descrição

- **Tag HTML Personalizado** para [***Google Tag Manager***](https://tagmanager.google.com) que é capaz de detectar qual conteúdo está sendo executado e até que ponto ocorreu a execução, sob a forma de valores inteiros entre 1 and 99 como porcentagem e sob a forma de valores reais em segundos;
- Nenhuma informação humanamente amigável está disponível *(nenhum nome de **episódio**, **faixa**, **artista**, **álbum**, **lista de reprodução** ou **show** será capturada, ainda que talvez seja possível por **Raspagem de DOM**)*:
- Cada conteúdo é identificado por uma [`URI do Spotify`](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids), que consiste em três partes:
  - `{plataforma}` **:** `{tipo de conteúd}` **:** `{identificador}`;
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
    var erUriSpotify = /spotify:(album|arist|episode|playlist|show|track):([^:\/?#&]+)/i;
    var resultado = { uri_spotify: uri, url_spotify: '' };
    if (erUriSpotify.test(uri)) {
        var correspondencias = erUriSpotify.exec(uri);
        var tipoConteudo = correspondencias[1];
        var idConteudo = correspondencias[2];
        resultado.url_spotify = `https://open.spotify.com/${tipoConteudo}/${idConteudo}`;
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

## Pré-Configuração: IFrame do Spotify

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

## Importando **Tags**, **Acionadores** and **Variáveis** no `Google Tag Manager`

- Salve o `JSON` abaixo em um arquivo e **importe-o** no [*Google Tag Manager*](https://tagmanager.google.com):
  - [`Admin`](https://tagmanager.google.com/#/admin) > `Importar Contêiner`.
- Adicione uma constante chamada `{{GA4 - Property ID}}` com seu **ID de Propriedade do [Google Analytics 4](https://analytics.google.com)**.

### Arquivo `JSON` de Contêiner Exportado do Google Tag Manager

```json
{
    "exportFormatVersion": 2,
    "exportTime": "2025-05-11 04:23:21",
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
                        "value": "{{GA4 - Property ID}}"
                    }
                ],
                "fingerprint": "1746796666011",
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
                        "value": "<script>\n// - The operation below is needed to assure the list of\n// percentages to be detected as progress events follow\n// the correct format.\nfunction truncateRemoveInvalidValuesDeduplicateSort(arr) {\n  var truncatedList = arr.map(function(element) {\n    return Math.trunc(element);\n  }).filter(function(element) {\n    return element > 0 && element < 100;\n  });\n  var uniqueValuesObject = {};\n  for (var i = 0; i < truncatedList.length; i++) {\n    uniqueValuesObject[truncatedList[i]] = true;\n  }\n  var uniqueList = Object.keys(uniqueValuesObject).map(function(key) {\n    return parseInt(key, 10);\n  });\n  uniqueList.sort(function(a, b) {\n    return a - b;\n  });\n  return uniqueList;\n}\n\n// - Edit the list below to setup progress events' percentage values:\n// (List with unique integer values ranging from 1 to 99, sorted in ascending order)\nvar spotifyPercentagesToBeDetected = truncateRemoveInvalidValuesDeduplicateSort(\n  [99, 20, 10.5, 60, 100, 40.05, 80, 90, 30, 50, 70, 0, 99.3]\n);\n// List is certainly [10, 20, 30, 40, 50, 60, 70, 80, 90, 99] after the cleansing.\n\n// - Check if a calculated percentage value should or not be detected.\nfunction shouldPercentageBeDetected(percent, detectionList) {\n  for (var i = 0; i < detectionList.length; i++) {\n    if (percent >= detectionList[i] && !(detectionList[i+1] && detectionList[i+1] <= percent)) {\n       return { check: true, value: detectionList[i] };\n    }\n  }\n  return { check: false, value: undefined };\n}\n\nvar spotifyWasPaused = false;\nvar spotifyAudioCompleted = false;\nvar spotifyRegisteredProgress = [];\nvar spotifyLastDuration = 0.0;\nvar spotifyLastURI = '';\nwindow.addEventListener('message', function(event) {\n  if (event.origin === 'https://open.spotify.com') {\n    var audioPercent = Math.trunc((event.data.payload.position / event.data.payload.duration) * 100) || 0;\n    var audioCurrentTime = (event.data.payload.position / 1000) || 0;\n    var audioDuration = (event.data.payload.duration / 1000) || 0;\n    var spotifyURI = event.data.payload.playingURI;\n    var spotifyEvent = {\n      event: 'spotifyEvent',\n      audioPercent: audioPercent,\n      audioCurrentTime: audioCurrentTime,\n      audioDuration: audioDuration,\n      spotifyURI: spotifyURI\n    }\n    // - Restart Playback Control Variables in case URI ou Duration has\n    // changed (track change detection within playlist, album or artist).\n    if ((spotifyURI && spotifyURI !== spotifyLastURI) || (spotifyURI && spotifyURI === spotifyLastURI && spotifyLastDuration !== audioDuration && spotifyLastDuration && audioDuration && Math.round(spotifyLastDuration) !== Math.round(audioDuration))) {\n      spotifyAudioCompleted = false;\n      spotifyWasPaused = false;\n      spotifyRegisteredProgress = [];\n    }\n    // 1. Progress Events\n    if (spotifyURI && shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).check) {\n      if (!spotifyRegisteredProgress.includes(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value)) {\n        spotifyRegisteredProgress.push(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value);\n        spotifyEvent.audioStatus = 'progress';\n        spotifyEvent.audioPercent = shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value;\n        dataLayer.push(spotifyEvent);\n        spotifyLastURI = spotifyURI;\n        if (audioDuration) spotifyLastDuration = audioDuration;\n      }\n    }\n    // 2. Playback updates\n    // 2.1. Playback Start\n    if (spotifyURI && event.data.type === 'playback_started') {\n      spotifyEvent.audioStatus = 'playback_started';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n    // 2.2. Playback Paused\n    } else if (spotifyURI && event.data.type === 'playback_update' && event.data.payload.isPaused && audioCurrentTime && !spotifyWasPaused) {\n      spotifyEvent.audioStatus = 'playback_paused';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyWasPaused = true;\n    // 2.3. Playback Resumed\n    } else if (spotifyURI && event.data.type === 'playback_update' && !event.data.payload.isPaused && spotifyWasPaused && event.data.payload.position) {\n      spotifyEvent.audioStatus = 'playback_resumed';\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyWasPaused = false;\n    // 2.4. Complete\n    } else if (spotifyURI && event.data.type === 'playback_update' && audioDuration === audioCurrentTime && !spotifyAudioCompleted) {\n      spotifyEvent.audioStatus = 'complete';\n      spotifyEvent.audioPercent = 100;\n      dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      if (audioDuration) spotifyLastDuration = audioDuration;\n      spotifyAudioCompleted = true;\n    }\n  }\n}, false);\n</script>"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "supportDocumentWrite",
                        "value": "false"
                    }
                ],
                "fingerprint": "1746892858395",
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
            }
        ],
        "trigger": [
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
            }
        ],
        "variable": [
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
            }
        ],
        "folder": [
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
                "folderId": "36",
                "name": "Spotify",
                "fingerprint": "1746252451511"
            }
        ],
        "fingerprint": "1746937401785",
        "tagManagerUrl": "https://tagmanager.google.com/#/versions/accounts/6054360526/containers/218106977/versions/0?apiLink=version"
    }
}
```
