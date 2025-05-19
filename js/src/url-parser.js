export default class Url {
    constructor(data) {
        this.url = data.url;
        this.parsedUrl = {
            parts: {
                domain: '',
                path: '',
                parameters: { str: '', list: [], obj: {} },
                fragment: { str: '', list: [], obj: {} }
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
            this.parsedUrl.parts.domain = groups[1];
            this.parsedUrl.parts.path = groups[2] || '/';
            this.parsedUrl.parts.parameters.str = groups[3] || '';
            this.parseKeyOptionalValue(
                groups[3], this.parsedUrl.parts.parameters, this.RegExp().Query);
            this.parsedUrl.parts.fragment.str = groups[4] || '';
            this.parseKeyOptionalValue(
                groups[4], this.parsedUrl.parts.fragment, this.RegExp().Fragment);
        }
    }

    parseKeyOptionalValue(captureGroup, keyOptionalValue, re) {
        if (captureGroup)
            while (re.test(captureGroup)) {
                const groups = re.exec(captureGroup);
                if (groups) {
                    if (groups[2]) {
                        keyOptionalValue.list.push(`${groups[1]}=${groups[2]||''}`);
                        keyOptionalValue.obj[groups[1]] = groups[2];
                    } else {
                        keyOptionalValue.list.push(groups[1]);
                        keyOptionalValue.obj[groups[1]] = '';
                    }
                    captureGroup = captureGroup.substring(groups[0].length+1);
                }
            }
    }

    getDomain() {
        return this.parsedUrl.parts.domain
    }

    getPath() {
        return this.parsedUrl.parts.path
    }

    getParameters() {
        return this.parsedUrl.parts.parameters.str
    }

    getFragment() {
        return this.parsedUrl.parts.fragment.str
    }

    getFullUrl() {
        return this.getDomain() + this.getPath() + this.getParameters()
        + this.getFragment()
    }
    
    getParsedUrl() {
        return this.parsedUrl
    }
}
