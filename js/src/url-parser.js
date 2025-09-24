export default class Url {
    constructor(data) {
        this.url = data.url;
        this.parsedUrl = {
            parts: {
                origin: '',
                path: ''
            }
        }
        if (this.RegExp().UrlParts.test(this.url)) {
            this.url = data.url.replaceAll('\\', '');
            this.parseUrl();
        }
    }

    RegExp() {
        return {
            UrlParts: /^((?:\w+:\/\/)?[^\/.:]+(?:\.[^\/.?#]+)+)((?:\/?(?:[^\/?#]+)?)*)?(\?(?:[^?#]+?)?)?(#(?:[^#]+?)?)?$/,
            Query: /([^?#&=]+)(?:=([^?#&=]+)?)?/,
            Fragment: /([^#&=]+)(?:=([^#&=]+)?)?/
        }
    }

    parseUrl() {
        if (this.RegExp().UrlParts.test(this.url)) {
            const groups = this.RegExp().UrlParts.exec(this.url);
            this.parsedUrl.parts.origin = groups[1];
            this.parsedUrl.parts.path = groups[2] || '/';
            var parameters = groups[3] || '';
            if (parameters) {
                this.parsedUrl.parts.parameters = this.parseKeyOptionalValue(
                    parameters, this.RegExp().Query);
            }
            var fragment = groups[4] || '';
            if (fragment) {
                this.parsedUrl.parts.fragment = this.parseKeyOptionalValue(
                    fragment, this.RegExp().Fragment);
            }
        }
    }

    parseKeyOptionalValue(captureGroup, re) {
        let obj = {};
        if (captureGroup)
            while (re.test(captureGroup)) {
                const groups = re.exec(captureGroup);
                if (groups) {
                    if (groups[2]) {
                        obj[groups[1]] = groups[2];
                    } else {
                        obj[groups[1]] = '';
                    }
                    captureGroup = captureGroup.substring(groups[0].length+1);
                }
            }
        return obj;
    }

    stringifyKeyOptionalValueObj(obj) {
        if (!Object.keys(obj).length) {
            return '';
        }
        return Object.entries(obj)
            .map(([key, value]) => {
                if (value) {
                    return `${key}=${value}`;
                } else {
                    return key;
                }
            })
            .join('&');
    }

    getOrigin() {
        return this.parsedUrl.parts.origin;
    }

    getPath() {
        return this.parsedUrl.parts.path;
    }

    getParameters() {
        if (!Object.hasOwn(this.parsedUrl.parts, 'parameters'))
            return '';
        return '?' + this.stringifyKeyOptionalValueObj(
            this.parsedUrl.parts.parameters);
    }

    getFragment() {
        if (!Object.hasOwn(this.parsedUrl.parts, 'fragment'))
            return '';
        return '#' + this.stringifyKeyOptionalValueObj(
            this.parsedUrl.parts.fragment);
    }

    getFullUrl() {
        return this.getOrigin() + this.getPath()
            + this.getParameters() + this.getFragment();
    }

    getParsedUrl() {
        return this.parsedUrl;
    }
}
