export const parseUrl = (url) => {
    const RegExp = { 
        UrlParts: /^((?:https?:\/\/)?[^\/]+\.[^\/]+)((?:\/[^\/?#]*)*)(\?\S*?)?(#\S*)?$/}
    url = url.replaceAll('\\', '');
    if (RegExp.UrlParts.test(url)) {
        const groups = RegExp.UrlParts.exec(url);
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
                fragment_obj[key] = value;})}
        return {
            parts: {
                domain: groups[1],
                path: groups[2] || '',
                parameters: {
                    str: groups[3] || '',
                    list: parameters_list,
                    obj: parameters_obj},
                fragment: {
                    str: groups[4] || '',
                    list: fragment_list,
                    obj: fragment_obj}},
            fullUrl: function() {
                return this.parts.domain + (this.parts.path || '') +
                    (this.parts.parameters.str || '') +
                    (this.parts.fragment.str || '')}};}
    return undefined;}
