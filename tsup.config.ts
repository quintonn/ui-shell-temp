import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    external: [
        "react",
        "react-dom",
        "react-router",
        "react-resizable-panels",
    ],
    format: ["esm"],
    outDir: "dist",
    sourcemap: true,
    splitting: false,
    target: "es2022",
    treeshake: true,
});