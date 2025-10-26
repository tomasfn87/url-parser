export const regexp = {
    UrlParts: /^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$/,
    Query: /([^?#&=]+)(?:=([^?#&=]+)?)?/,
    Fragment: /([^#&=]+)(?:=([^#&=]+)?)?/,
    YouTubeVideo: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?(?:(?:watch)?\?.*v=|embed\/)?([0-9A-Za-z_-]{11}).*/i,
    YouTubePlaylist: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?.*?(?:play)?list=([0-9A-Za-z_-]+)/i,
    YouTubeUser: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?.*@([^\/?#=]+).*/i,
    YouTubeLive: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?(?:live\/)?([0-9A-Za-z_-]{11}).*/i,
    VimeoVideo: /(https?:\/\/)?(\w+\.)?vimeo.com\/(\d+)/i,
    SpotifyContent: /(?:https?:\/\/)?(?:\w+\.)?spotify.com\/.*(track|episode|playlist|album|artist|show)\/([^\/?#=]+)\S*/i,
    SpotifyUri: /spotify:(album|artist|episode|playlist|show|track):([^ \/?&#=]+)/i
};

const parseKeyOptionalValue = (captureGroup, re) => {
    let obj = {};
    if (captureGroup)
        while (re.test(captureGroup)) {
            const groups = re.exec(captureGroup);
            if (groups) {
                const groups_str = groups[0].toString();
                if (groups_str.includes('=')) {
                    if (!groups_str.endsWith('='))
                        obj[groups[1]] = groups[2];
                    else
                        obj[groups[1]] = ' ';
                } else
                    obj[groups[1]] = null;
                captureGroup = captureGroup.substring(groups[0].length+1);
            }
        }
    return obj;
}

export const stringifyKeyOptionalValueObj = (obj) => {
    if (!Object.keys(obj).length) {
        return '';
    }
    return Object.entries(obj)
        .map(([key, value]) => {
            if (value != null && value != ' ')
                return `${key}=${value}`;
            else if (value == ' ')
                return `${key}=`;
            else
                return key;
        })
        .join('&');
}

export const parseUrl = (url) => {
    url = url.replaceAll('\\', '').replaceAll(' ', '');
    const match = url.match(regexp.UrlParts);
    if (!match) {
        return undefined;
    }
    const origin = match[1] || '';
    const path = match[2] || '/';
    let parsedUrl = {
        parts: {
            origin: origin,
            path: path
        }
    }
    const queryString = match[3] || '';
    if (queryString.length) {
        parsedUrl.parts.parameters =
            parseKeyOptionalValue(queryString, regexp.Query);
    }
    const hashString = match[4] || '';
    if (hashString.length) {
        parsedUrl.parts.fragment =
            parseKeyOptionalValue(hashString, regexp.Fragment);
    }
    parsedUrl.fullUrl = () => {
        let fullUrl = origin + path;
        if (Object.hasOwn(parsedUrl.parts, 'parameters'))
            fullUrl += '?' + stringifyKeyOptionalValueObj(parsedUrl.parts.parameters);
        if (Object.hasOwn(parsedUrl.parts, 'fragment'))
            fullUrl += '#' + stringifyKeyOptionalValueObj(parsedUrl.parts.fragment);
        return fullUrl;
    }
    return parsedUrl;
};

export const correctMediaLink = (link) => {
    if (/https:\/\/(127.0.0.1|localhost).*/i.test(link))
        link = link.replace('https://', 'http://');
    return link;
};