import type { AppGlobals } from "../types/app";

const STARTUP_DELAY_MS = 1000;

const FALLBACK_GLOBALS: AppGlobals = {
    appName: "Qbic v2",
    authType: "oidc",
    sidebarItems: [
        { id: "home", label: "Home", to: "/", icon: "home" },
        { id: "about", label: "About", to: "/about", icon: "info" },
    ],
    navbarItems: [
        { id: "config", label: "Config", to: "/about", align: "left" },
        { id: "settings", label: "Settings", icon: "gear", actionId: "nav.settings", align: "right" },
        {
            id: "profile",
            label: "Profile",
            icon: "profile",
            align: "right",
            items: [
                { id: "profile-view", label: "Profile", to: "/" },
                { id: "profile-config", label: "Config", to: "/about" },
                { id: "profile-logout", label: "Logout", actionId: "auth.logout" },
            ],
        },
    ],
    layout: {
        includeTopBar: true,
        leftSidebarPlacement: "over-nav",
        rightSidebarPlacement: "under-nav",
        allowSidebarResize: true,
        allowRightSidebarResize: true,
    },
};

let startupPromise: Promise<AppGlobals> | null = null;

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

export function runAppStartupService() {
    if (!startupPromise) {
        startupPromise = (async () => {
            // Placeholder for startup work (token fetch, feature flags, config warmup, etc.)
            await sleep(STARTUP_DELAY_MS);

            try {
                const response = await fetch("/api/app-config", {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    return FALLBACK_GLOBALS;
                }

                const serverConfig = (await response.json()) as Partial<AppGlobals>;

                return {
                    ...FALLBACK_GLOBALS,
                    ...serverConfig,
                    layout: {
                        ...FALLBACK_GLOBALS.layout,
                        ...(serverConfig.layout ?? {}),
                    },
                    sidebarItems: serverConfig.sidebarItems ?? FALLBACK_GLOBALS.sidebarItems,
                    navbarItems: serverConfig.navbarItems ?? FALLBACK_GLOBALS.navbarItems,
                };
            } catch {
                return FALLBACK_GLOBALS;
            }
        })();
    }

    return startupPromise;
}
