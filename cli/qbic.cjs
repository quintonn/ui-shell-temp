#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_HTML_PATH = path.join("src", "index.html");

function printHelp() {
    console.log(`qbic

Usage:
    qbic dev --entry <module-path>
    qbic build --entry <module-path>

Defaults:
    html output: ${DEFAULT_HTML_PATH}
`);
}

function parseArgs(argv) {
    const args = argv.slice(2);
    const command = args[0];

    if (!command || command === "--help" || command === "-h") {
        return { command: "help", htmlPath: DEFAULT_HTML_PATH, entryPath: null };
    }

    let entryPath = null;

    for (let index = 1; index < args.length; index += 1) {
        const arg = args[index];
        const value = args[index + 1];

        if (arg === "--entry" && value) {
            entryPath = value;
            index += 1;
            continue;
        }
    }

    return { command, htmlPath: DEFAULT_HTML_PATH, entryPath };
}

function ensureHtmlFile(htmlPath, entryPath) {
    const absoluteHtmlPath = path.resolve(process.cwd(), htmlPath);

    if (fs.existsSync(absoluteHtmlPath)) {
        return absoluteHtmlPath;
    }

    fs.mkdirSync(path.dirname(absoluteHtmlPath), { recursive: true });
    fs.writeFileSync(
        absoluteHtmlPath,
        `<!doctype html>\n<html>\n\n<head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n</head>\n\n<body>\n    <script type="module" src="${entryPath}"></script>\n</body>\n\n</html>\n`,
        "utf8"
    );

    console.log(`[qbic] Created ${htmlPath}`);
    return absoluteHtmlPath;
}

function runParcel(command, htmlPath) {
    const parcelArgs = command === "build"
        ? ["build", htmlPath, "--target", "app"]
        : [htmlPath, "--target", "app"];
    const child = spawn("npx", ["--no-install", "parcel", ...parcelArgs], {
        cwd: process.cwd(),
        stdio: "inherit",
        shell: true,
    });

    child.on("exit", (code) => {
        process.exit(code ?? 0);
    });

    child.on("error", (error) => {
        console.error(`[qbic] Failed to start Parcel: ${error.message}`);
        process.exit(1);
    });
}

(function main() {
    const { command, htmlPath, entryPath } = parseArgs(process.argv);

    if (command === "help") {
        printHelp();
        return;
    }

    if (command !== "dev" && command !== "build") {
        console.error(`[qbic] Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }

    if (!entryPath) {
        console.error("[qbic] Missing required argument: --entry <module-path>");
        printHelp();
        process.exit(1);
    }

    ensureHtmlFile(htmlPath, entryPath);
    runParcel(command, htmlPath);
})();