export default class Url {
    constructor(data) {
        this.url = data.url.replaceAll('\\', '');
        this.parsedUrl = {};
        const RegExp = { 
            UrlParts: /^((?:\w+:\/\/)?[^\.\/]+(?:\.[^.\/]+)+)((?:\/[^\/?#=&]*)*)?(\?(?:&?[^\/?#=&]+(?:=[^\/?#=&]*)?)+)?(#(?:&?[^\/?#=&]+(?:=[^\/?#=&]*)?)+)?$/
        }
        this.parsedUrl = {
            parts: {
                domain: '',
                path: '',
                parameters: {
                    str: '',
                    list: [],
                    obj: {}
                },
                fragment: {
                    str: '',
                    list: [],
                    obj: {}
                }
            }
        }
        if (RegExp.UrlParts.test(this.url)) {
            const groups = RegExp.UrlParts.exec(this.url);
            let parameters_list = [];
            if (groups[3]) {
                parameters_list = groups[3].slice(1).split('&');}
            let parameters_obj = {};
            if (parameters_list.length) {
                parameters_list.forEach(e => {
                    const [key, value] = e.split('=');
                    parameters_obj[key] = value;})}
            let fragment_list = [];
            if (groups[4]) {
                fragment_list = groups[4].slice(1).split('&');}
            let fragment_obj = {};
            if (fragment_list.length) {
                fragment_list.forEach(e => {
                    const [key, value] = e.split('=');
                    fragment_obj[key] = value;
                })
            }
            this.parsedUrl = {
                parts: {
                    domain: groups[1],
                    path: groups[2] || '/',
                    parameters: {
                        str: groups[3] || '',
                        list: parameters_list,
                        obj: parameters_obj
                    },
                    fragment: {
                        str: groups[4] || '',
                        list: fragment_list,
                        obj: fragment_obj
                    }
                }
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

