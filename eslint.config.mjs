import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: ["dist/**", "dist-app/**", "node_modules/**", ".parcel-cache/**", "src/js/**", "create-ui-app/template/**"],
    },
    {
        files: ["**/*.{js,cjs,mjs}"],
        ...js.configs.recommended,
        languageOptions: {
            ...js.configs.recommended.languageOptions,
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
    {
        files: ["src/**/*.{ts,tsx}", "dev-app/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["./*", "../*"],
                            message: "Use @/... alias imports instead of relative imports.",
                        },
                    ],
                },
            ],
        },
    },
];
