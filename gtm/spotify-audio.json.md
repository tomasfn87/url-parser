# [`Spotify`](https://www.spotify.com) Audio Tag for [Google Tag Manager](https://tagmanager.google.com)

## Description

- **Custom HTML Tag** for [***Google Tag Manager***](https://tagmanager.google.com) which is able detect which content is being played and how far it's been played, as integer values between 1 and 99 (in percentages) and as floating point values (in seconds);
- No actual human friendly information is availabe *(no **episode**, **track**, **artist**, **album**, **playlist** or **show name** will be captured even though it might be viable via **DOM Scraping**)*:
- Each content is identified by a [`Spotify URI`](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids), which consists in three parts:
  - `{platform}` **:** `{content type}` **:** `{identifier}`;
  - ***Examples:***
    - `spotify` **:** `album` **:** `7Ff0Q5oeEoVKHtxJJoXyId`;
    - `spotify` **:** `artist` **:** `1on7ZQ2pvgeQF4vmIA09x5`;
    - `spotify` **:** `episode` **:** `5DVGuabuaHaC9UxQodcyvf`;
    - `spotify` **:** `playlist` **:** `0E6htK22DGE5d4jj3r6dmS`.
  - Different ***tracks*** executed within a ***playlist*** are identified only by their **duration**:
    - This allows us to count how many **tracks** where executed (*partially or completely*) within a grouped content (*playlist, artists or album*).
 - **Show URLs** (*i.e. [`open.spotify.com/show/3bdzILat9px7eH27ziXl8K`](https://open.spotify.com/show/3bdzILat9px7eH27ziXl8K)*) redirect to the show's last episode.

---

## Where can I test it

- Visit this project's [Web App](https://tomasfn87.github.io/url-parser?spotifycontent=artist:1nJvji2KIlWSseXRSlNYsC&utm_source=github&utm_medium=spotify-tag-readme), open the console (`F12`) and type `dataLayer` to see the tag working (a Spotify content will already be loaded).

---

## Implemented Events

- `audio_playback_started`;
- `audio_playback_paused`;
- `audio_playback_resumed`;
- `audio_complete`;
- `audio_progress`:
  - ***Detected percentages values*** are **configured** and **validated** in the `Spotify audio Custom HTML tag` (i.e. `[ 25, 50, 75 ]`).

---

## Tag Parameters

- `audio_content`;
- `audio_content_type`;
- `audio_current_time`;
- `audio_duration`;
- `audio_percent`;
- `audio_provider`;
- `audio_status`.

---

## `JavaScript` function to convert **Spotify's** ***URI*** into ***URL***

- Any URI can be transformed into a [`open.spotify.com`](https://open.spotify.com) link by following the **template** below:
   - **`URI`**:
     - `spotify` **:** `album` **:** `7Ff0Q5oeEoVKHtxJJoXyId`.
   - **`URL`**:
     - `https://open.spotify.com` **/** `album` **/** `7Ff0Q5oeEoVKHtxJJoXyId`.

```javascript
(function getSpotifyUrlFromUri(uri) {
    var reSpotifyUri = /spotify:([^:]+):([^:]+)/i;
    var result = { spotify_uri: uri, spotify_url: '' };
    if (reSpotifyUri.test(uri)) {
        var matches = reSpotifyUri.exec(uri);
        var contentType = matches[1];
        var contentId = matches[2];
        result.spotify_url = 'https://open.spotify.com/'+contentType+'/'+contentId;
    }
    return result;
})(
    'spotify:album:7Ff0Q5oeEoVKHtxJJoXyId'
);
```

### Expected Output

```javascript
{
    spotify_uri: 'spotify:album:7Ff0Q5oeEoVKHtxJJoXyId',
    spotify_url: 'https://open.spotify.com/album/7Ff0Q5oeEoVKHtxJJoXyId'
}
```

---

## Spotify Audio Custom HTML Tag for [Google Tag Manager](https://tagmanager.google.com)

> For further implementation details, please visit the [Spotify's Community topic](https://community.spotify.com/t5/Spotify-for-Developers/Spotify-iFrame-tracking-via-GTM-Any-code/m-p/6945950) where this implementation was developed and published.

```html
<script>
(function spotifyAudioListenerTag() {
  // - Edit the list below to setup Progress events detected
  // percentage values:
  var spotifyPercentagesToBeDetected = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 99
  ]
  // - The operation below is needed to ensure the list of
  // percentages to be detected as progress events follow
  // the correct format.
  spotifyPercentagesToBeDetected = (function(arr) {
    var onlyNumsTruncatedList = arr.filter(function(element) {
      return typeof element === 'number';
    }).map(function(element) {
      return Math.trunc(element);
    }).filter(function(element) {
      return element > 0 && element < 100;
    });
    var uniqueValuesObject = {};
    for (var i = 0; i < onlyNumsTruncatedList.length; i++) {
      uniqueValuesObject[onlyNumsTruncatedList[i]] = true;
    }
    var uniqueList = Object.keys(uniqueValuesObject).map(function(key) {
      return parseInt(key, 10);
    });
    uniqueList.sort(function(a, b) {
      return a - b;
    });
    return uniqueList;
  })(spotifyPercentagesToBeDetected);
  var minDetectionValue = Math.min.apply(null, spotifyPercentagesToBeDetected);

  // - Check if a calculated percentage value should or
  // not be detected.
  function shouldPercentageBeDetected(percent, detectionList) {
    for (var i = 0; i < detectionList.length; i++) {
      if (percent >= detectionList[i] && !(detectionList[i+1] && detectionList[i+1] <= percent)) {
        return { check: true, value: detectionList[i] };
      }
    }
    return { check: false, value: undefined };
  }

  window.dataLayer = window.dataLayer || [];
  var spotifyWasPaused = false;
  var spotifyRegisteredProgress = [];
  var spotifyLastDuration = 0.0;
  var spotifyLastURI = '';
  var spotifyLastEventString = '';
  sessionStorage.setItem('spotifyLastStatus', '');
  window.addEventListener('message', function(event) {
    // Leave if not a Spotify Event
    if (!(event.origin === 'https://open.spotify.com'))
      return;
    var spotifyEventString = event.data.payload
      && (JSON.stringify(event.data.payload.isPaused)
      + JSON.stringify(event.data.payload.position)
      + JSON.stringify(event.data.payload.playingUri)) || '';
    // Leave if current event is the same as last event, otherwise update
    if (spotifyEventString === spotifyLastEventString)
      return;
    else
      spotifyLastEventString = spotifyEventString;
    var audioPercent = Math.trunc((event.data.payload.position / event.data.payload.duration) * 100) || 0;
    var audioCurrentTime = (event.data.payload.position / 1000) || 0;
    var audioDuration = (event.data.payload.duration / 1000) || 0;
    var spotifyURI = event.data.payload.playingURI;
    var reSpotifyUri = /spotify:([^:]+):([^:]+)/i;
    var audioData = (function(uri) {
      var result = { contentType: '', url: '' };
      if (reSpotifyUri.test(uri)) {
        var parts = reSpotifyUri.exec(uri);
        result.contentType = parts && parts[1];
        result.url = parts && 'https://open.spotify.com/'+parts[1]+'/'+parts[2];
      }
      return result;
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
    // - Detect playback restart
    if ((sessionStorage.getItem('spotifyLastStatus') === 'complete'
      && audioData.contentType !== 'episode') || event.data.type === 'playback_started')
      sessionStorage.setItem('spotifyLastStatus', 'playback_started');
    // - Detect track rewind or restart
    if (audioData.contentType === 'track' && audioPercent < minDetectionValue) {
      spotifyWasPaused = false;
      spotifyRegisteredProgress = [];
    }
    // - Restart Playback Control Variables in case URI or duration has
    // changed or a complete event has just fired (track change detection
    // within playlist, album or artist).
    if ((spotifyURI && spotifyURI !== spotifyLastURI)
      || event.data.type === 'playback_started'
      || sessionStorage.getItem('spotifyLastStatus') === 'complete'
      || (spotifyURI && spotifyURI === spotifyLastURI
        && Math.trunc(audioDuration) !== Math.trunc(spotifyLastDuration))) {
      spotifyWasPaused = false;
      spotifyRegisteredProgress = [];
    }
    // 1. Playback updates
    // 1.1. Playback Start
    if (spotifyURI && event.data.type === 'playback_started') {
      spotifyEvent.audioStatus = 'playback_started';
      window.dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      spotifyLastStatus = spotifyEvent.audioStatus;
      // 1.2. Playback Paused
    } else if (spotifyURI && event.data.type === 'playback_update' && event.data.payload.isPaused
      && audioCurrentTime && !spotifyWasPaused) {
      spotifyEvent.audioStatus = 'playback_paused';
      window.dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      spotifyLastDuration = audioDuration;
      spotifyWasPaused = true;
      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);
      // 1.3. Playback Resumed
    } else if (spotifyURI && event.data.type === 'playback_update'
      && !event.data.payload.isPaused && spotifyWasPaused && event.data.payload.position) {
      spotifyEvent.audioStatus = 'playback_resumed';
      window.dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      spotifyLastDuration = audioDuration;
      spotifyWasPaused = false;
      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);
      // 1.4. Complete
    } else if (spotifyURI && event.data.type === 'playback_update' && audioDuration === audioCurrentTime
      && sessionStorage.getItem('spotifyLastStatus') !== 'complete') {
      spotifyEvent.audioStatus = 'complete';
      spotifyEvent.audioPercent = 100;
      window.dataLayer.push(spotifyEvent);
      spotifyLastURI = spotifyURI;
      spotifyLastDuration = audioDuration;
      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);
    }
    // - No progress events after a complete event
    if (sessionStorage.getItem('spotifyLastStatus') === 'complete')
      return;
    // 2. Progress Events
    if (spotifyURI && shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).check) {
      if (!spotifyRegisteredProgress.includes(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value)) {
        spotifyRegisteredProgress.push(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value);
        spotifyEvent.audioStatus = 'progress';
        spotifyEvent.audioPercent = shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value;
        window.dataLayer.push(spotifyEvent);
        spotifyLastURI = spotifyURI;
        spotifyLastDuration = audioDuration;
      }
    }
  }, false);
})();
</script>
```

---

## Importing **Tags**, **Triggers** and **Variables** in `Google Tag Manager`

- Save the `JSON` below to a file and **import it** in [*Google Tag Manager*](https://tagmanager.google.com):
  - [`Admin`](https://tagmanager.google.com/#/admin) > `Import Container`.
- Add a constant named `{{GA4 - Datastream Measurement ID}}` with your **[Google Analytics 4](https://analytics.google.com)'s Property's Measurement ID** (_format_ `G-<10 numbers and letters>`).

### Google Tag Manager's Exported Container `JSON` file

```json
{
    "exportFormatVersion": 2,
    "exportTime": "2025-06-26 02:28:44",
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
                        "value": "<script>\n(function spotifyAudioListenerTag() {\n  // - Edit the list below to setup Progress events detected\n  // percentage values:\n  var spotifyPercentagesToBeDetected = [\n    10, 20, 30, 40, 50, 60, 70, 80, 90, 99\n  ]\n  // - The operation below is needed to ensure the list of\n  // percentages to be detected as progress events follow\n  // the correct format.\n  spotifyPercentagesToBeDetected = (function(arr) {\n    var onlyNumsTruncatedList = arr.filter(function(element) {\n      return typeof element === 'number';\n    }).map(function(element) {\n      return Math.trunc(element);\n    }).filter(function(element) {\n      return element > 0 && element < 100;\n    });\n    var uniqueValuesObject = {};\n    for (var i = 0; i < onlyNumsTruncatedList.length; i++) {\n      uniqueValuesObject[onlyNumsTruncatedList[i]] = true;\n    }\n    var uniqueList = Object.keys(uniqueValuesObject).map(function(key) {\n      return parseInt(key, 10);\n    });\n    uniqueList.sort(function(a, b) {\n      return a - b;\n    });\n    return uniqueList;\n  })(spotifyPercentagesToBeDetected);\n  var minDetectionValue = Math.min.apply(null, spotifyPercentagesToBeDetected);\n\n  // - Check if a calculated percentage value should or\n  // not be detected.\n  function shouldPercentageBeDetected(percent, detectionList) {\n    for (var i = 0; i < detectionList.length; i++) {\n      if (percent >= detectionList[i] && !(detectionList[i+1] && detectionList[i+1] <= percent)) {\n        return { check: true, value: detectionList[i] };\n      }\n    }\n    return { check: false, value: undefined };\n  }\n\n  window.dataLayer = window.dataLayer || [];\n  var spotifyWasPaused = false;\n  var spotifyRegisteredProgress = [];\n  var spotifyLastDuration = 0.0;\n  var spotifyLastURI = '';\n  var spotifyLastEventString = '';\n  sessionStorage.setItem('spotifyLastStatus', '');\n  window.addEventListener('message', function(event) {\n    // Leave if not a Spotify Event\n    if (!(event.origin === 'https://open.spotify.com'))\n      return;\n    var spotifyEventString = event.data.payload\n      && (JSON.stringify(event.data.payload.isPaused)\n      + JSON.stringify(event.data.payload.position)\n      + JSON.stringify(event.data.payload.playingUri)) || '';\n    // Leave if current event is the same as last event, otherwise update\n    if (spotifyEventString === spotifyLastEventString)\n      return;\n    else\n      spotifyLastEventString = spotifyEventString;\n    var audioPercent = Math.trunc((event.data.payload.position / event.data.payload.duration) * 100) || 0;\n    var audioCurrentTime = (event.data.payload.position / 1000) || 0;\n    var audioDuration = (event.data.payload.duration / 1000) || 0;\n    var spotifyURI = event.data.payload.playingURI;\n    var reSpotifyUri = /spotify:([^:]+):([^:]+)/i;\n    var audioData = (function(uri) {\n      var result = { contentType: '', url: '' };\n      if (reSpotifyUri.test(uri)) {\n        var parts = reSpotifyUri.exec(uri);\n        result.contentType = parts && parts[1];\n        result.url = parts && 'https://open.spotify.com/'+parts[1]+'/'+parts[2];\n      }\n      return result;\n    })(spotifyURI);\n    var spotifyEvent = {\n      event: 'spotifyEvent',\n      audioPercent: audioPercent,\n      audioCurrentTime: audioCurrentTime,\n      audioDuration: audioDuration,\n      audioContentType: audioData.contentType,\n      audioUrl: audioData.url,\n      spotifyURI: spotifyURI\n    }\n    // - Detect playback restart\n    if ((sessionStorage.getItem('spotifyLastStatus') === 'complete'\n      && audioData.contentType !== 'episode') || event.data.type === 'playback_started')\n      sessionStorage.setItem('spotifyLastStatus', 'playback_started');\n    // - Detect track rewind or restart\n    if (audioData.contentType === 'track' && audioPercent < minDetectionValue) {\n      spotifyWasPaused = false;\n      spotifyRegisteredProgress = [];\n    }\n    // - Restart Playback Control Variables in case URI or duration has\n    // changed or a complete event has just fired (track change detection\n    // within playlist, album or artist).\n    if ((spotifyURI && spotifyURI !== spotifyLastURI)\n      || event.data.type === 'playback_started'\n      || sessionStorage.getItem('spotifyLastStatus') === 'complete'\n      || (spotifyURI && spotifyURI === spotifyLastURI\n        && Math.trunc(audioDuration) !== Math.trunc(spotifyLastDuration))) {\n      spotifyWasPaused = false;\n      spotifyRegisteredProgress = [];\n    }\n    // 1. Playback updates\n    // 1.1. Playback Start\n    if (spotifyURI && event.data.type === 'playback_started') {\n      spotifyEvent.audioStatus = 'playback_started';\n      window.dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      spotifyLastStatus = spotifyEvent.audioStatus;\n      // 1.2. Playback Paused\n    } else if (spotifyURI && event.data.type === 'playback_update' && event.data.payload.isPaused\n      && audioCurrentTime && !spotifyWasPaused) {\n      spotifyEvent.audioStatus = 'playback_paused';\n      window.dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      spotifyLastDuration = audioDuration;\n      spotifyWasPaused = true;\n      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);\n      // 1.3. Playback Resumed\n    } else if (spotifyURI && event.data.type === 'playback_update'\n      && !event.data.payload.isPaused && spotifyWasPaused && event.data.payload.position) {\n      spotifyEvent.audioStatus = 'playback_resumed';\n      window.dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      spotifyLastDuration = audioDuration;\n      spotifyWasPaused = false;\n      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);\n      // 1.4. Complete\n    } else if (spotifyURI && event.data.type === 'playback_update' && audioDuration === audioCurrentTime\n      && sessionStorage.getItem('spotifyLastStatus') !== 'complete') {\n      spotifyEvent.audioStatus = 'complete';\n      spotifyEvent.audioPercent = 100;\n      window.dataLayer.push(spotifyEvent);\n      spotifyLastURI = spotifyURI;\n      spotifyLastDuration = audioDuration;\n      sessionStorage.setItem('spotifyLastStatus', spotifyEvent.audioStatus);\n    }\n    // - No progress events after a complete event\n    if (sessionStorage.getItem('spotifyLastStatus') === 'complete')\n      return;\n    // 2. Progress Events\n    if (spotifyURI && shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).check) {\n      if (!spotifyRegisteredProgress.includes(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value)) {\n        spotifyRegisteredProgress.push(shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value);\n        spotifyEvent.audioStatus = 'progress';\n        spotifyEvent.audioPercent = shouldPercentageBeDetected(audioPercent, spotifyPercentagesToBeDetected).value;\n        window.dataLayer.push(spotifyEvent);\n        spotifyLastURI = spotifyURI;\n        spotifyLastDuration = audioDuration;\n      }\n    }\n  }, false);\n})();\n</script>"
                    },
                    {
                        "type": "BOOLEAN",
                        "key": "supportDocumentWrite",
                        "value": "false"
                    }
                ],
                "fingerprint": "1750904791412",
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
        "fingerprint": "1750904924359",
        "tagManagerUrl": "https://tagmanager.google.com/#/versions/accounts/6054360526/containers/218106977/versions/0?apiLink=version"
    }
}
```
