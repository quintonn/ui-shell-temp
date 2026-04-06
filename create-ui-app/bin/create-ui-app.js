#!/usr/bin/env node

import { spawn } from "node:child_process";
import { cp, mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { stdin, stdout } from "node:process";

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDirectory = path.resolve(packageDirectory, "template");

async function main() {
    const parsedArguments = parseArguments(process.argv.slice(2));

    if (parsedArguments.help) {
        printHelp();
        return;
    }

    const readlineInterface = createInterface({ input: stdin, output: stdout });
    const defaultUiAppDependency = await resolveDefaultUiAppDependency();

    try {
        const rawTargetDirectory = parsedArguments.targetDirectory ?? await promptForValue(readlineInterface, "Project folder name", "my-ui-app");
        const uiAppDependency = parsedArguments.uiAppDependency ?? await promptForValue(readlineInterface, "Dependency spec for @quintonn/ui-app", defaultUiAppDependency);
        const shouldInstallDependencies = parsedArguments.skipInstall ? false : await promptForConfirmation(readlineInterface, "Run npm install after scaffolding?", true);

        const targetDirectory = path.resolve(process.cwd(), rawTargetDirectory);
        const projectName = path.basename(targetDirectory);
        const packageName = sanitizePackageName(projectName);
        const appNameVariants = deriveAppNameVariants(projectName);

        if (!packageName) {
            throw new Error("Could not derive a valid npm package name from the target directory.");
        }

        if (!appNameVariants.pascalCaseName || !appNameVariants.camelCaseName) {
            throw new Error("Could not derive valid class names from the project name.");
        }

        await ensureDirectoryIsEmptyOrMissing(targetDirectory);
        await mkdir(targetDirectory, { recursive: true });
        await cp(templateDirectory, targetDirectory, { recursive: true });
        await renameTemplateGitignore(targetDirectory);
        await renameTemplateFiles(targetDirectory, appNameVariants);

        await replaceTemplateTokens(targetDirectory, {
            "__PROJECT_NAME__": packageName,
            "__PROJECT_TITLE__": projectName,
            "__UI_APP_DEPENDENCY__": uiAppDependency,
            "__APP_PASCAL_NAME__": appNameVariants.pascalCaseName,
            "__APP_CAMEL_NAME__": appNameVariants.camelCaseName,
        });

        if (shouldInstallDependencies) {
            await runCommand("npm", ["install"], targetDirectory);
        }

        stdout.write(`\nCreated ${projectName} in ${targetDirectory}\n`);
        stdout.write("\nNext steps:\n");
        stdout.write(`  cd ${projectName}\n`);
        if (!shouldInstallDependencies) {
            stdout.write("  npm install\n");
        }
        stdout.write("  npm run dev\n");
    } finally {
        readlineInterface.close();
    }
}

async function resolveDefaultUiAppDependency() {
    const repoUiAppPackageJsonPath = path.resolve(packageDirectory, "..", "package.json");

    try {
        const packageJsonText = await readFile(repoUiAppPackageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonText);

        if (packageJson.name === "@quintonn/ui-app" && typeof packageJson.version === "string" && packageJson.version.length > 0) {
            return `^${packageJson.version}`;
        }
    } catch {
        // Fall back when the scaffolder is running from an installed package instead of the repo.
    }

    return "latest";
}

function parseArguments(argumentsList) {
    const parsedArguments = {
        help: false,
        skipInstall: false,
        targetDirectory: undefined,
        uiAppDependency: undefined,
    };

    for (let index = 0; index < argumentsList.length; index += 1) {
        const argument = argumentsList[index];

        if (argument === "--help" || argument === "-h") {
            parsedArguments.help = true;
            continue;
        }

        if (argument === "--skip-install") {
            parsedArguments.skipInstall = true;
            continue;
        }

        if (argument === "--ui-app-dependency") {
            parsedArguments.uiAppDependency = argumentsList[index + 1];
            index += 1;
            continue;
        }

        if (argument.startsWith("--ui-app-dependency=")) {
            parsedArguments.uiAppDependency = argument.split("=", 2)[1];
            continue;
        }

        if (!parsedArguments.targetDirectory) {
            parsedArguments.targetDirectory = argument;
            continue;
        }
    }

    return parsedArguments;
}

function printHelp() {
    stdout.write("Usage: create-ui-app <project-directory> [--skip-install] [--ui-app-dependency <spec>]\n");
}

async function promptForValue(readlineInterface, promptLabel, defaultValue) {
    const answer = await readlineInterface.question(`${promptLabel} (${defaultValue}): `);
    const trimmedAnswer = answer.trim();
    return trimmedAnswer || defaultValue;
}

async function promptForConfirmation(readlineInterface, promptLabel, defaultValue) {
    const defaultHint = defaultValue ? "Y/n" : "y/N";
    const answer = await readlineInterface.question(`${promptLabel} (${defaultHint}): `);
    const trimmedAnswer = answer.trim().toLowerCase();

    if (!trimmedAnswer) {
        return defaultValue;
    }

    return trimmedAnswer === "y" || trimmedAnswer === "yes";
}

function sanitizePackageName(rawProjectName) {
    return rawProjectName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function deriveAppNameVariants(rawProjectName) {
    const projectNameParts = rawProjectName
        .trim()
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((namePart) => namePart.replace(/[^a-zA-Z0-9]/g, ""));

    const pascalCaseName = projectNameParts
        .map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase())
        .join("");

    const camelCaseName = pascalCaseName
        ? pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1)
        : "";

    return {
        pascalCaseName,
        camelCaseName,
    };
}

async function ensureDirectoryIsEmptyOrMissing(targetDirectory) {
    try {
        const directoryEntries = await readdir(targetDirectory);
        if (directoryEntries.length > 0) {
            throw new Error(`Target directory already exists and is not empty: ${targetDirectory}`);
        }
    } catch (error) {
        if (error && error.code === "ENOENT") {
            return;
        }

        throw error;
    }
}

async function renameTemplateGitignore(targetDirectory) {
    const sourcePath = path.join(targetDirectory, "_gitignore");
    const targetPath = path.join(targetDirectory, ".gitignore");

    try {
        await rename(sourcePath, targetPath);
    } catch (error) {
        if (!error || error.code !== "ENOENT") {
            throw error;
        }
    }
}

async function renameTemplateFiles(targetDirectory, appNameVariants) {
    const sourceServicePath = path.join(targetDirectory, "src", "services", "__APP_CAMEL_NAME__UIService.tsx");
    const targetServicePath = path.join(targetDirectory, "src", "services", `${appNameVariants.camelCaseName}UIService.tsx`);

    try {
        await rename(sourceServicePath, targetServicePath);
    } catch (error) {
        if (!error || error.code !== "ENOENT") {
            throw error;
        }
    }
}

async function replaceTemplateTokens(targetDirectory, replacements) {
    const textFileExtensions = new Set([".json", ".md", ".html", ".js", ".ts", ".tsx", ".svg"]);
    const pendingPaths = [targetDirectory];

    while (pendingPaths.length > 0) {
        const currentPath = pendingPaths.pop();
        const currentStat = await stat(currentPath);

        if (currentStat.isDirectory()) {
            const directoryEntries = await readdir(currentPath);
            for (const directoryEntry of directoryEntries) {
                pendingPaths.push(path.join(currentPath, directoryEntry));
            }
            continue;
        }

        if (!textFileExtensions.has(path.extname(currentPath))) {
            continue;
        }

        let fileContents = await readFile(currentPath, "utf8");
        for (const [token, replacement] of Object.entries(replacements)) {
            fileContents = fileContents.split(token).join(replacement);
        }
        await writeFile(currentPath, fileContents);
    }
}

async function runCommand(command, argumentsList, workingDirectory) {
    await new Promise((resolve, reject) => {
        const childProcess = spawn(command, argumentsList, {
            cwd: workingDirectory,
            stdio: "inherit",
            shell: process.platform === "win32",
        });

        childProcess.on("exit", (exitCode) => {
            if (exitCode === 0) {
                resolve();
                return;
            }

            reject(new Error(`${command} ${argumentsList.join(" ")} failed with exit code ${exitCode ?? "unknown"}`));
        });

        childProcess.on("error", reject);
    });
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});