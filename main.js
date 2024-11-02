import { color, parseUrl } from './url-parser.js';

const main = () => {
    const input = process.argv[2].replaceAll('\\', '')
    const object = (process.argv[3] || '').toLowerCase();
    const r = parseUrl(input);
    if (object === "native") {
        console.log(r);
        return;}
    const title = "brightYellow";
    const subtitle = "yellow";
    const content = "white";
    if (r) {
        color.log(title, "Domain");
        process.stdout.write(":\n- ");
        color.log(content, `${r.domain}\n\n`);
        if (r.path) {
            color.log(title, "Path");
            process.stdout.write(":\n- ");
            color.log(content, `${r.path}\n\n`);}
        if (r.parameters) {
            color.log(title, "Parameters");
            process.stdout.write(":\n");}
        if (Object.keys(r.parameters_obj).length) {
            let maxLength = 0;
            Object.entries(r.parameters_obj).forEach(e => {
                if (e[0].length > maxLength) maxLength = e[0].length;});
            Object.entries(r.parameters_obj).forEach(e => {
                process.stdout.write("- ");
                color.log(subtitle, `${e[0].padStart(maxLength)}`)
                process.stdout.write(":");
                color.log(content, ` ${e[1]}\n`);});
            console.log();}
        if (r.fragment) {
            color.log(title, "Fragment");
            process.stdout.write(":\n");}
        if (Object.keys(r.fragment_obj).length) {
            let maxLength = 0;
            Object.entries(r.fragment_obj).forEach(e => {
                if (e[0].length > maxLength) maxLength = e[0].length;});
            Object.entries(r.fragment_obj).forEach(e => {
                process.stdout.write("- ");
                if (e[1]) {
                    color.log(subtitle, `${e[0].padStart(maxLength)}`)
                    process.stdout.write(":");
                    color.log(content, ` ${e[1]}`);}
                else {
                    color.log(content, `${e[0].padStart(maxLength)}`)}
                console.log();});
            console.log();}
        const fullUrl = (r.domain + (r.path || '') + (r.parameters || '')
            + (r.fragment || ''));
        if (input == fullUrl) {
            color.log(title, "Full URL");
            process.stdout.write(":\n- ");
            color.log(content, `${fullUrl}\n`);}}
    else
        console.log("Invalid URL.");}

main();
