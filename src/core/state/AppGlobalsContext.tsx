import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { AppGlobals } from "../types/app";

type AppGlobalsContextValue = AppGlobals & {
    /**
     * Called when a nav/sidebar item with an `actionId` is clicked.
     * Wire this up in your app to handle custom actions (e.g. navigate, logout, open modal).
     * If not provided, `actionId` clicks are no-ops.
     */
    onActionClick?: (actionId: string) => void | Promise<void>;
};

const DEFAULT_APP_GLOBALS: AppGlobalsContextValue = {
    appName: "App",
    authType: "none",
    theme: {
        brandColor: "#0f766e",
        accentColor: "#0ea5e9",
        surfaceColor: "#ffffff",
        textColor: "#0f172a",
    },
    sidebarItems: [
        { id: "home", label: "Home", to: "/", icon: "home" },
    ],
    navbarItems: [],
    layout: {
        includeTopBar: true,
        leftSidebarPlacement: "over-nav",
        rightSidebarPlacement: "under-nav",
        allowSidebarResize: true,
        allowRightSidebarResize: true,
    },
};

const AppGlobalsContext = createContext<AppGlobalsContextValue>(DEFAULT_APP_GLOBALS);

type AppGlobalsProviderProps = {
    value: AppGlobals;
    /**
     * Handler for `actionId`-based nav/sidebar items.
     * Typically wired to your action service in app/App.tsx.
     * Can be omitted entirely if you only use `to`-based items.
     */
    onActionClick?: (actionId: string) => void | Promise<void>;
    children: ReactNode;
};

export function AppGlobalsProvider({ value, onActionClick, children }: AppGlobalsProviderProps) {
    useEffect(() => {
        document.title = value.appName;

        document.documentElement.style.setProperty("--app-brand-color", value.theme.brandColor);
        document.documentElement.style.setProperty("--app-accent-color", value.theme.accentColor);
        document.documentElement.style.setProperty("--app-surface-color", value.theme.surfaceColor);
        document.documentElement.style.setProperty("--app-text-color", value.theme.textColor);
    }, [value.appName, value.theme.accentColor, value.theme.brandColor, value.theme.surfaceColor, value.theme.textColor]);

    return (
        <AppGlobalsContext.Provider value={{ ...value, onActionClick }}>
            {children}
        </AppGlobalsContext.Provider>
    );
}

export function useAppGlobals() {
    return useContext(AppGlobalsContext);
}
