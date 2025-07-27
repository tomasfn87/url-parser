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
            Query: /([^?#&=]+)(?:=([^?#&=]+))?/,
            Fragment: /([^#&=]+)(?:=([^#&=]+))?/
        }
    }

    parseUrl() {
        if (this.RegExp().UrlParts.test(this.url)) {
            const groups = this.RegExp().UrlParts.exec(this.url);
            this.parsedUrl.parts.origin = groups[1];
            this.parsedUrl.parts.path = groups[2] || '/';
            var parameters = groups[3] || '';
            if (parameters) {
                this.parsedUrl.parts.parameters = { str: parameters, obj: {} };
                this.parseKeyOptionalValue(
                    parameters, this.parsedUrl.parts.parameters,
                    this.RegExp().Query);
            }
            var fragment = groups[4] || '';
            if (fragment) {
                this.parsedUrl.parts.fragment = { str: fragment, obj: {} }
                this.parseKeyOptionalValue(
                    fragment, this.parsedUrl.parts.fragment,
                    this.RegExp().Fragment);
            }
        }
    }

    parseKeyOptionalValue(captureGroup, keyOptionalValue, re) {
        if (captureGroup)
            while (re.test(captureGroup)) {
                const groups = re.exec(captureGroup);
                if (groups) {
                    if (groups[2]) {
                        keyOptionalValue.obj[groups[1]] = groups[2];
                    } else {
                        keyOptionalValue.obj[groups[1]] = '';
                    }
                    captureGroup = captureGroup.substring(groups[0].length+1);
                }
            }
    }

    getOrigin() {
        return this.parsedUrl.parts.origin;
    }

    getPath() {
        return this.parsedUrl.parts.path;
    }

    getParameters() {
        return this.parsedUrl.parts.parameters?.str || '';
    }

    getFragment() {
        return this.parsedUrl.parts.fragment?.str || '';
    }

    getFullUrl() {
        return this.getOrigin() + this.getPath()
            + this.getParameters() + this.getFragment();
    }
    
    getParsedUrl() {
        return this.parsedUrl;
    }
}
