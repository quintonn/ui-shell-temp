import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRootDirectory = path.resolve(scriptDirectory, "..");
const sourceTailwindRuntimePath = path.join(projectRootDirectory, "src", "js", "tailwind_4_2_1.js");
const sourceTailwindSourceMapPath = path.join(projectRootDirectory, "src", "js", "tailwind.map");
const targetDirectoryPath = path.join(projectRootDirectory, "dist", "js");
const targetTailwindRuntimePath = path.join(targetDirectoryPath, "tailwind_4_2_1.js");
const targetTailwindSourceMapPath = path.join(targetDirectoryPath, "tailwind.map");

await mkdir(targetDirectoryPath, { recursive: true });
await copyFile(sourceTailwindRuntimePath, targetTailwindRuntimePath);
await copyFile(sourceTailwindSourceMapPath, targetTailwindSourceMapPath);

console.log(`[build:package] Copied ${path.relative(projectRootDirectory, sourceTailwindRuntimePath)} -> ${path.relative(projectRootDirectory, targetTailwindRuntimePath)}`);
console.log(`[build:package] Copied ${path.relative(projectRootDirectory, sourceTailwindSourceMapPath)} -> ${path.relative(projectRootDirectory, targetTailwindSourceMapPath)}`);