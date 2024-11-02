import { parseUrl } from './url-parser.js';
import { color } from './color.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const main = () => {
    const input = process.argv[2].replaceAll('\\', '')
    const object = (process.argv[3] || '').toLowerCase();
    const r = parseUrl(input);
    if (object === "native") {
        console.log(r);
        return;}
    const {title, subtitle, content} = loadConfigFile("config.json");
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

const loadConfigFile = (file) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const configFile = path.join(__dirname, file);
    const defaultConfig = {
        title: "brightCyan", subtitle: "cyan", content: "white"};
    if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));}
    const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    let error = false;
    Object.entries(config).forEach(e => {
        if (!color.validate(e[1])) {
            color.log("dim", "The color ");
            color.log("brightRed", e[1]);
            color.log("dim", " is not a valid option for ");
            color.log("white", e[0])
            color.log("dim", ". Default ");
            color.log(defaultConfig[e[0]], defaultConfig[e[0]]);
            color.log("dim", " will be used instead.\n");
            config[e[0]] = defaultConfig[e[0]];
            fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
            error = true;}})
    if (error) {
        process.stdout.write("\nSuggested colors: ");
        const skip = 5;
        for (let i=0; i<color.list().slice(skip).length - 2; i++) {
            color.log(color.list().slice(skip)[i],
                color.list().slice(skip)[i]);
            color.log("dim", ", ")}
        color.log(color.list().slice(skip)[color.list().slice(skip).length-2],
            color.list().slice(skip)[color.list().slice(skip).length-2]);
        color.log("dim", " and ");
        color.log(color.list().slice(skip)[color.list().slice(skip).length-1],
            color.list().slice(skip)[color.list().slice(skip).length-1]);
        color.log("dim", ".\n\n");}
    return config;}

main();
