export type KeyOptionalValue = {
    [key: string]: string | number | null | undefined;
};

export default interface ParsedUrl {
    origin: string;
    path: string;
    parameters: KeyOptionalValue | null;
    fragment: KeyOptionalValue | null;
    fullUrl: Function;
}

export const regexp = {
    UrlParts: /^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$/,
    Query: /([^?#&=]+)(?:=([^?#&=]+)?)?/,
    Fragment: /([^#&=]+)(?:=([^#&=]+)?)?/
};

export const regexpMedia = {
    YouTubeVideo: {
        re: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?(?:(?:watch)?\?.*v=|embed\/)?([0-9A-Za-z_-]{11}).*/i,
        identifier: 'youtubevideo',
        getId: (url: string): string | null => {
            return regexpMedia.YouTubeVideo.re.exec(url)?.[4] || null;
        }
    },
    YouTubePlaylist: {
        re: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?.*?(?:play)?list=([0-9A-Za-z_-]+)/i,
        identifier: 'youtubeplaylist',
        getId: (url: string): string | null => {
            return regexpMedia.YouTubePlaylist.re.exec(url)?.[4] || null;
        }
    },
    YouTubeUser: {
        re: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?.*@([^\/?#=]+).*/i,
        identifier: 'youtubeuser',
        getId: (url: string): string | null => {
            return regexpMedia.YouTubeUser.re.exec(url)?.[4] || null;;
        }
    },
    YouTubeLive: {
        re: /(https?:\/\/)?((?:www|m)\.)?youtu(\.be|be\.com)\/?(?:live\/)([0-9A-Za-z_-]{11}).*/i,
        identifier: 'youtubelive',
        getId: (url: string): string | null => {
            return regexpMedia.YouTubeLive.re.exec(url)?.[4] || null;
        }
    },
    VimeoVideo: {
        re: /(https?:\/\/)?(\w+\.)?vimeo.com\/(\d+)/i,
        identifier: 'vimeovideo',
        getId: (url: string): string | null => {
            return regexpMedia.VimeoVideo.re.exec(url)?.[3] || null;
        }
    },
    SpotifyContent: {
        re: /(?:https?:\/\/)?(?:\w+\.)?spotify.com\/.*(album|artist|episode|playlist|show|track)\/([^\/?#=]+)\S*/i,
        identifier: 'spotifycontent',
        getId: (url: string): string | null => {
            return (regexpMedia.SpotifyContent.re.exec(url)?.[1] || null)
                + ':' + (regexpMedia.SpotifyContent.re.exec(url)?.[2] || null);
        }
    },
    SpotifyUri: {
        re: /spotify:(album|artist|episode|playlist|show|track):([^ \/?&#=]+)/i,
        identifier: 'spotifyuri',
        getId: (url: string): string | null => {
            return (regexpMedia.SpotifyUri.re.exec(url)?.[1] || null)
                + ':' + (regexpMedia.SpotifyUri.re.exec(url)?.[2] || null);
        }
    }
}

const parseKeyOptionalValue = (
    captureGroup: string, re: RegExp): KeyOptionalValue => {
    let obj: KeyOptionalValue = {};
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

export const stringifyKeyOptionalValueObj = (
    obj: KeyOptionalValue): string => {
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

export const parseUrl = (url: string): ParsedUrl | null => {
    url = url.replaceAll('\\', '').replaceAll(' ', '');
    const match = url.match(regexp.UrlParts);
    if (!match) {
        return null;
    }
    const origin = match[1] || '';
    const path = match[2] || '/';
    let parsedUrl: ParsedUrl = {
        origin: origin,
        path: path,
        parameters: {} as KeyOptionalValue,
        fragment: {} as KeyOptionalValue,
        fullUrl: () => ''
    }
    const queryString = match[3] || '';
    if (queryString.length > 1) {
        parsedUrl.parameters =
            parseKeyOptionalValue(queryString, regexp.Query);
    }
    const hashString = match[4] || '';
    if (hashString.length > 1) {
        parsedUrl.fragment =
            parseKeyOptionalValue(hashString, regexp.Fragment);
    }
    parsedUrl.fullUrl = () => {
        let fullUrl = origin + path;
        if (parsedUrl.parameters !== null && Object.keys(parsedUrl.parameters).length)
            fullUrl += '?' + stringifyKeyOptionalValueObj(parsedUrl.parameters);
        if (parsedUrl.fragment !== null && Object.keys(parsedUrl.fragment).length)
            fullUrl += '#' + stringifyKeyOptionalValueObj(parsedUrl.fragment);
        return fullUrl;
    }
    return parsedUrl;
};

export const correctMediaLink = (link: string): string => {
    if (/https:\/\/(127.0.0.1|localhost).*/i.test(link))
        link = link.replace('https://', 'http://');
    return link;
};