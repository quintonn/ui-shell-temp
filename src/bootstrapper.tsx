import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalStartupSpinner } from "@/core/components/GlobalStartupSpinner";
import { AppGlobals } from "@/core/types/app";
import { CachedAppStartupService } from "@/core/services/appStartupService";
import { DefaultIconService } from "@/core/services/iconService";
import { App } from "@/app/App";
import { DEFAULT_APP_GLOBALS } from "@/core/state/AppGlobalsContext";

// Re-exports for downstream consumers
export { CachedAppStartupService } from "@/core/services/appStartupService";
export { DefaultIconService } from "@/core/services/iconService";
export type { AppGlobals, SidebarItem, NavbarItem, NavbarLinkItem, NavbarMenuItem, NavbarSubItem, Dictionary } from "@/core/types/app";

const BASE_STYLES = `html,
body,
#root {
    height: 100%;
}

body {
    margin: 0;
}`;

const STYLESET_DATA_ATTR = "data-ui-app-styles";
const TAILWIND_DATA_ATTR = "data-ui-app-tailwind-runtime";

function ensureStylesheet() {
    const existing = document.querySelector(`style[${STYLESET_DATA_ATTR}='true']`);
    if (existing) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        const style = document.createElement("style");
        style.textContent = BASE_STYLES;
        style.setAttribute(STYLESET_DATA_ATTR, "true");
        document.head.appendChild(style);
        resolve();
    });
}

function ensureTailwindRuntime() {
    const existing = document.querySelector(`script[${TAILWIND_DATA_ATTR}='true']`);
    if (existing) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL("./js/tailwind_4_2_1.js", import.meta.url).toString();
        script.async = false;
        script.setAttribute(TAILWIND_DATA_ATTR, "true");
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load packaged Tailwind runtime."));
        document.head.appendChild(script);
    });
}

type StartupGateProps = {
    startupService: CachedAppStartupService | null;
};

function StartupGate({ startupService }: StartupGateProps) {
    const [globals, setGlobals] = React.useState<AppGlobals | null>(null);
    const [iconService] = React.useState<DefaultIconService>(
        () => startupService?.getIconService() ?? new DefaultIconService()
    );
    const routeElements = startupService?.getRouteElements() ?? {};
    const bootstrapComponent = startupService?.getBootstrapComponent();

    React.useEffect(() => {
        let isActive = true;

        if (startupService) {
            startupService.run().then((startupGlobals) => {
                if (isActive) {
                    setGlobals(startupGlobals);
                }
            });
        } else {
            setGlobals(DEFAULT_APP_GLOBALS);
        }
        return () => {
            isActive = false;
        };
    }, [startupService]);

    if (!globals) {
        return <GlobalStartupSpinner />;
    }

    return (
        <BrowserRouter>
            <App
                globals={globals}
                iconService={iconService}
                routeElements={routeElements}
                bootstrapComponent={bootstrapComponent}
                onReady={() => startupService?.onReady()}
            />
        </BrowserRouter>
    );
}

export async function bootstrapApp(startupService: CachedAppStartupService | null) {
    let rootElement = document.getElementById("root");

    if (!rootElement) {
        rootElement = document.createElement("div");
        rootElement.id = "root";
        console.log("Adding a root div for bootstrap to work");
        document.body.appendChild(rootElement);
    }

    if (process.env.NODE_ENV !== "production") {
        const bodyScripts = document.querySelectorAll("body script");
        if (bodyScripts.length > 1) {
            console.warn(`[bootstrapApp] Expected 1 script in <body>, found ${bodyScripts.length}. Remove extra script tags.`);
        }
    }

    await ensureStylesheet();
    await ensureTailwindRuntime();

    createRoot(rootElement).render(
        <React.StrictMode>
            <StartupGate startupService={startupService} />
        </React.StrictMode>
    );
}
