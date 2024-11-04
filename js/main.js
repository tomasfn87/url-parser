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
        console.log(r.parts);
        return;}
    if (!r) {
        console.log("Invalid URL.");
        return;}
    const {title, subtitle, content} = loadConfigFile("config.json");
    color.log(title, "Domain");
    process.stdout.write(":\n- ");
    color.log(content, `${r.parts.domain}\n\n`);
    if (r.parts.path) {
        color.log(title, "Path");
        process.stdout.write(":\n- ");
        color.log(content, `${r.parts.path}\n\n`);}
    let maxLength = 0;
    if (r.parts.parameters.str) {
        color.log(title, "Parameters");
        process.stdout.write(":\n");}
    if (Object.keys(r.parts.parameters.obj).length) {
        Object.entries(r.parts.parameters.obj).forEach(e => {
            if (e[0].length > maxLength) maxLength = e[0].length;});
        Object.entries(r.parts.parameters.obj).forEach(e => {
            process.stdout.write("- ");
            color.log(subtitle, `${e[0].padStart(maxLength)}`)
            process.stdout.write(":");
            color.log(content, ` ${e[1]}\n`);});
        console.log();}
    if (r.parts.fragment.str) {
        color.log(title, "Fragment");
        process.stdout.write(":\n");}
    if (Object.keys(r.parts.fragment.obj).length) {
        Object.entries(r.parts.fragment.obj).forEach(e => {
            if (e[0].length > maxLength) maxLength = e[0].length;});
        Object.entries(r.parts.fragment.obj).forEach(e => {
            process.stdout.write("- ");
            if (e[1]) {
                color.log(subtitle, `${e[0].padStart(maxLength)}`)
                process.stdout.write(":");
                color.log(content, ` ${e[1]}`);}
            else
                color.log(content, `${e[0].padStart(maxLength)}`);
            console.log();});
        console.log();}
    if (input == r.fullUrl()) {
        color.log(title, "Full URL");
        process.stdout.write(":\n- ");
        color.log(content, `${r.fullUrl()}\n`);}}

const loadConfigFile = (file) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const configFile = path.join(__dirname, file);
    const defaultConfig = {
        title: "cyan", subtitle: "brightCyan", content: "default"};
    if (!fs.existsSync(configFile))
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    let config = defaultConfig;
    try {
        config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
        if (!Object.keys(config).includes("title") ||
            !Object.keys(config).includes("subtitle") ||
            !Object.keys(config).includes("content")) {
            config = defaultConfig;
            fs.writeFileSync(configFile, JSON.stringify(config, null, 2));}}
    catch {
        config = defaultConfig;
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));}
    let error = false;
    Object.entries(config).forEach(e => {
        if (!color.validate(e[1])) {
            error = true;
            color.log("brightRed", "Error");
            color.log("dim", ": the color ");
            color.log("brightRed", e[1]);
            color.log("dim", " is not a valid option for ");
            color.log("default", e[0]);
            color.log("dim", ". The color ");
            color.log(defaultConfig[e[0]], defaultConfig[e[0]]);
            color.log("dim", " will be used instead.\n");
            config[e[0]] = defaultConfig[e[0]];}})
    if (error) {
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
        process.stdout.write("\nSuggested colors: ");
        const skip = 6;
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