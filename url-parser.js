export const parseUrl = (url) => {
    const RegExp = { 
        UrlParts: /^((?:https?:\/\/)?[^\/]+)((?:\/[^\/?#]*)*)(\?\S*?)?(#\S*)?$/}
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
            domain: groups[1] || '',
            path: groups[2] || '',
            parameters: groups[3] || '',
            parameters_list: parameters_list,
            parameters_obj: parameters_obj,
            fragment: groups[4] || '',
            fragment_list: fragment_list,
            fragment_obj: fragment_obj};}
    return undefined;}

export const color = {
    log: (color, text) => {
        const colors = {
            reset: '\x1b[0m',             bold: '\x1b[1m',
            dim: '\x1b[2m',               italic: '\x1b[3m',
            underline: '\x1b[4m',         blink: '\x1b[5m',
            reverse: '\x1b[7m',           hidden: '\x1b[8m',
            strikethrough: '\x1b[9m',     black: '\x1b[30m',
            red: '\x1b[31m',              green: '\x1b[32m',
            yellow: '\x1b[33m',           blue: '\x1b[34m',
            magenta: '\x1b[35m',          cyan: '\x1b[36m',
            white: '\x1b[37m',            brightBlack: '\x1b[90m',
            brightRed: '\x1b[91m',        brightGreen: '\x1b[92m',
            brightYellow: '\x1b[93m',     brightBlue: '\x1b[94m',
            brightMagenta: '\x1b[95m',    brightCyan: '\x1b[96m',
            brightWhite: '\x1b[97m',      bgBlack: '\x1b[40m',
            bgRed: '\x1b[41m',            bgGreen: '\x1b[42m',
            bgYellow: '\x1b[43m',         bgBlue: '\x1b[44m',
            bgMagenta: '\x1b[45m',        bgCyan: '\x1b[46m',
            bgWhite: '\x1b[47m',          bgBrightBlack: '\x1b[100m',
            bgBrightRed: '\x1b[101m',     bgBrightGreen: '\x1b[102m',
            bgBrightYellow: '\x1b[103m',  bgBrightBlue: '\x1b[104m',
            bgBrightMagenta: '\x1b[105m', bgBrightCyan: '\x1b[106m',
            bgBrightWhite: '\x1b[107m'};
        const colorCode = colors[color.toLowerCase()] || colors.reset;
        process.stdout.write(`${colorCode}${text}${colors.reset}`);}}
