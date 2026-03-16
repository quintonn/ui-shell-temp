import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { AppGlobals } from "../types/app";
import { DefaultIconService } from "../services/iconService";

type AppGlobalsContextValue = AppGlobals & {
    /**
     * Called when a nav/sidebar item with an `actionId` is clicked.
     * Wire this up in your app to handle custom actions (e.g. navigate, logout, open modal).
     * If not provided, `actionId` clicks are no-ops.
     */
    onActionClick?: (actionId: string) => void | Promise<void>;
    iconService: DefaultIconService;
};

export const DEFAULT_APP_GLOBALS: AppGlobalsContextValue = {
    appName: "App",
    authType: "none",
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
    iconService: new DefaultIconService(),
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
    iconService?: DefaultIconService;
    children: ReactNode;
};

export function AppGlobalsProvider({ value, onActionClick, iconService = new DefaultIconService(), children }: AppGlobalsProviderProps) {
    useEffect(() => {
        document.title = value.appName;
    }, [value.appName]);

    return (
        <AppGlobalsContext.Provider value={{ ...value, onActionClick, iconService }}>
            {children}
        </AppGlobalsContext.Provider>
    );
}

export function useAppGlobals() {
    return useContext(AppGlobalsContext);
}
