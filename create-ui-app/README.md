# create-ui-app

This folder contains a complete scaffolder package in one place.

## What Is Here

- `bin/create-ui-app.js`: the CLI entry point
- `template/`: the project template that gets copied into a new app
- `package.json`: the package manifest you can publish to GitHub Packages

## Local Usage

Set `GH_TOKEN` to github pat with permissons to read packages.

Create .npmrc with the following:  
```
@quintonn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_TOKEN}
```

From this folder, run:

```powershell
npx @quintonn/create-ui-app@latest my-new-app
```

If you want the script to install dependencies automatically, omit `--skip-install`.

## Publish To GitHub Packages

This package is set up for a private GitHub Packages registry under the `@quintonn` scope.

1. Authenticate npm against `https://npm.pkg.github.com`.
2. From this folder, run `npm publish`.
3. Consumers can then run `npx @quintonn/create-ui-app@latest my-new-app`.

If your GitHub org or username is not `quintonn`, update the package name and scope in this file.

## Template Notes

The generated app expects `@quintonn/ui-app` to be installable from your registry. The CLI prompts for the dependency spec so you can use a version like `^1.0.0`, a dist-tag, or another valid npm spec.

When you run the scaffolder from this repository, the default dependency is resolved from the repo root `@quintonn/ui-app` version automatically. When you run the published scaffolder from elsewhere, it falls back to `latest` unless you pass `--ui-app-dependency` explicitly.