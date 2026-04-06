# ui-app

Reusable React application shell package built around `bootstrapApp(...)` and a custom `CachedAppStartupService` implementation.

## Consumer shape

A consuming app only needs:

1. An `index.html` that loads its entry module.
2. An `AppConfig.tsx` file that imports `bootstrapApp` from this package.
3. A startup service that provides globals, routes, and optional icon overrides.

Example `index.html`:

```html
<!doctype html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ui-app consumer</title>
</head>

<body>
    <div id="root"></div>
    <script type="module" src="./AppConfig.tsx"></script>
</body>

</html>
```

The `#root` element is recommended, but not strictly required. `bootstrapApp(...)` will create it automatically if it is missing.

Example:

```tsx
import type { ReactElement } from "react";
import {
    bootstrapApp,
    CachedAppStartupService,
    type AppGlobals,
    type Dictionary,
    type UIService,
} from "@quintonn/ui-app";
import { HomePage } from "@/pages/HomePage";

class MyUIService implements UIService {
    getPageTitle(path: string): Promise<string> {
        let cleanPath = path.toLowerCase();
        if (cleanPath.startsWith("/")) {
            cleanPath = cleanPath.substring(1);
        }

        switch (cleanPath) {
            case "home":
            case "":
                return Promise.resolve("Home");
            case "about":
                return Promise.resolve("About");
            case "inventory":
                return Promise.resolve("Inventory");
            case "settings":
                return Promise.resolve("Settings");
            default:
                return Promise.resolve("Unknown Path: " + cleanPath);
        }
    }

    getRouteElements(): Dictionary<ReactElement> {
        return {
            "index": <HomePage />,
            // "about": <AboutPage />,
            // "inventory": <InventoryPage />,
            // "inventory/:id": <InventoryDetailPage />,
            // "settings": <div>Settings page TODO</div>,
            "logout": <div>Logout action TODO</div>,
        };
    }

    getBootstrapComponent() {
        return null;
    }
}

class MyStartupService extends CachedAppStartupService {
    protected async initialize(): Promise<AppGlobals> {
        return {
            appName: "Example",
            authType: "none",
            sidebarItems: [],
            navbarItems: [],
            layout: {
                includeTopBar: true,
                leftSidebarPlacement: "under-nav",
                rightSidebarPlacement: "hidden",
                allowSidebarResize: true,
                allowRightSidebarResize: false,
            },
        };
    }

    getUIService(): UIService {
        return new MyUIService();
    }
}

bootstrapApp(new MyStartupService());
```

`getBootstrapComponent()` is optional. Return `null` for a very basic app, or return a component if you need startup-side UI effects that rely on hooks.

## Development commands

- `npm run dev`: Run the example app through the existing Parcel-based CLI.
- `npm run build`: Build the publishable library into `dist/`.
- `npm run build:app`: Build the example app bundle into `dist-app/`.
- `npm run lint`: Run ESLint.

## Local package testing

### Option 1: Tarball install with npm pack

This is the simplest publish test and is usually the best first check.

```powershell
npm run build
npm pack
```

Then in another project:

```powershell
npm install ..\path\to\ui-app-1.0.0.tgz
```

### Option 2: Local private npm registry with Verdaccio

```powershell
npx verdaccio
npm publish --registry http://localhost:4873
```

Then in another project:

```powershell
npm install ui-app --registry http://localhost:4873
```

## Private GitHub package publishing

This repository is configured to publish to GitHub Packages as `@quintonn/ui-app`.

1. Create a GitHub personal access token with package publish/read permissions.
2. Run `npm login --scope=@quintonn --registry=https://npm.pkg.github.com`.
3. Run `npm publish`.

If you want this package to stay private, keep the GitHub repository private and publish it to GitHub Packages instead of the public npm registry.

To install from GitHub Packages in another project:

```powershell
npm install @quintonn/ui-app
```

That consuming project also needs an `.npmrc` entry for the scope:

```text
@quintonn:registry=https://npm.pkg.github.com
```