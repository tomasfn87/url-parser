import Url from './src/url-parser.js';
import { color } from './util/color.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const main = () => {
    const input = process.argv[2] || '';
    if (!input) {
        console.log("Empty URL.")
        return;
    }
    let decode = false;
    const r = new Url({ url: input });
    if (!r.parsedUrl.parts.origin) {
        console.log("Invalid URL.");
        return;
    }
    if (process.argv.slice(1).includes("--decode")) {
        decode = true;
    }
    if (process.argv.slice(1).includes("--native")) {
        if (decode) {
            r.parsedUrl.parts.origin =
                decodeURIComponent(r.parsedUrl.parts.origin);
            r.parsedUrl.parts.path =
                decodeURIComponent(r.parsedUrl.parts.path);
            if (Object.hasOwn(r.parsedUrl.parts, 'parameters')) {
                let newParameters = {};
                Object.entries(r.parsedUrl.parts.parameters).forEach(([k, v]) => {
                    newParameters[decodeURIComponent(k)] = 
                        decodeURIComponent(v);
                })
                r.parsedUrl.parts.parameters = newParameters;
            }
            if (Object.hasOwn(r.parsedUrl.parts, 'fragment')) {
                let newFragment = {};
                Object.entries(r.parsedUrl.parts.fragment).forEach(([k, v]) => {
                    newFragment[decodeURIComponent(k)] = 
                        decodeURIComponent(v);
                })
                r.parsedUrl.parts.fragment = newFragment;
            }
        }
        console.log(r.parsedUrl.parts);
        return;
    }
    const {title, subtitle, content} = loadConfigFile("config.json");
    color.log(title, "Origin");
    process.stdout.write(":\n- ");
    color.log(content, `${r.getOrigin()}\n`);
    color.log(title, "Path");
    process.stdout.write(":\n- ");
    color.log(content,
        `${decode?decodeURIComponent(r.getPath()):r.getPath()}\n`);
    let maxLength = 0;
    if (Object.hasOwn(r.parsedUrl.parts, 'parameters')) {
        if (Object.keys(r.parsedUrl.parts.parameters).length) {
            Object.entries(r.parsedUrl.parts.parameters).forEach(e => {
                if (e[1] && e[0].length > maxLength)
                    maxLength = e[0].length;
            });
        }
    }
    if (Object.hasOwn(r.parsedUrl.parts, 'fragment')) {
        if (Object.keys(r.parsedUrl.parts.fragment).length) {
            Object.entries(r.parsedUrl.parts.fragment).forEach(e => {
                if (e[1] && e[0].length > maxLength)
                    maxLength = e[0].length;
            });
        }
    }
    if (Object.hasOwn(r.parsedUrl.parts, 'parameters')) {
        color.log(title, "Parameters");
        process.stdout.write(":\n");
        Object.entries(r.parsedUrl.parts.parameters).forEach(e => {
            process.stdout.write("- ");
            if (e[1]) {
                color.log(subtitle, `${e[0].padStart(maxLength)}`)
                process.stdout.write(":");
                color.log(content, ` ${decode?decodeURIComponent(e[1]):e[1]}`);
            }
            else
                color.log(content, `${e[0]}`);
            console.log();
        });
    }
    if (Object.hasOwn(r.parsedUrl.parts, 'fragment')) {
        color.log(title, "Fragment");
        process.stdout.write(":\n");
        if (Object.keys(r.parsedUrl.parts.fragment).length) {
            Object.entries(r.parsedUrl.parts.fragment).forEach(e => {
                process.stdout.write("- ");
                if (e[1]) {
                    color.log(subtitle, `${e[0].padStart(maxLength)}`)
                    process.stdout.write(":");
                    color.log(content, ` ${decode?decodeURIComponent(e[1]):e[1]}`);
                }
                else
                    color.log(content, `${e[0]}`);
                console.log();
            });
        }
    }
    color.log(title, "Full URL");
    process.stdout.write(":\n- ");
    color.log(content, `${r.getFullUrl()}\n`);
}

const loadConfigFile = (file) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const configFile = path.join(__dirname, file);
    const defaultConfig = {
        title: "cyan", subtitle: "brightCyan", content: "default"
    };
    if (!fs.existsSync(configFile))
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    let config = defaultConfig;
    try {
        config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
        if (!Object.keys(config).includes("title") ||
            !Object.keys(config).includes("subtitle") ||
            !Object.keys(config).includes("content")) {
            config = defaultConfig;
            fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
        }
    }
    catch {
        config = defaultConfig;
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    }
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
            config[e[0]] = defaultConfig[e[0]];
        }
    })
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
        color.log("dim", ".\n\n");
    }
    return config;
}

main();
