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
            domain: groups[1],
            path: groups[2] || '',
            parameters: groups[3] || '',
            parameters_list: parameters_list,
            parameters_obj: parameters_obj,
            fragment: groups[4] || '',
            fragment_list: fragment_list,
            fragment_obj: fragment_obj};}
    return undefined;}
