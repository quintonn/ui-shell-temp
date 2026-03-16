import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import type { AppGlobals } from "../types/app";
import { DefaultIconService } from "../services/iconService";

type AppGlobalsContextValue = AppGlobals & {
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
    iconService?: DefaultIconService;
    children: ReactNode;
};

export function AppGlobalsProvider({ value, iconService = new DefaultIconService(), children }: AppGlobalsProviderProps) {
    useEffect(() => {
        document.title = value.appName;
    }, [value.appName]);

    const contextValue = useMemo<AppGlobalsContextValue>(() => ({
        ...value,
        iconService,
    }), [iconService, value]);

    return (
        <AppGlobalsContext.Provider value={contextValue}>
            {children}
        </AppGlobalsContext.Provider>
    );
}

export function useAppGlobals() {
    return useContext(AppGlobalsContext);
}
