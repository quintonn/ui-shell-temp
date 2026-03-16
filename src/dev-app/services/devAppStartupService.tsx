import { CachedAppStartupService } from "@/core/services/appStartupService";
import { DefaultIconService } from "@/core/services/iconService.js";
import { type AppGlobals, type Dictionary, type NavbarItem, type SidebarItem } from "@/core/types/app";
import { type ReactElement } from "react";
import { AboutPage } from "../pages/AboutPage";
import { HomePage } from "../pages/HomePage";

const STARTUP_DELAY_MS = 1000;

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Home", to: "/", icon: "home" },
    { id: "about", label: "About", to: "/about", icon: "info" },
];

const navbarItems: NavbarItem[] = [
    { id: "config", label: "Config", to: "/about", align: "left" },
    { id: "settings", label: "Settings", icon: "gear", to: "/settings", align: "right" },
    {
        id: "profile",
        label: "Profile",
        icon: "profile",
        align: "right",
        items: [
            { id: "profile-view", label: "Profile", to: "/" },
            { id: "profile-config", label: "Config", to: "/about" },
            { id: "profile-logout", label: "Logout", to: "/logout" },
        ]
    },
];

export class DevAppStartupService extends CachedAppStartupService {
    protected async initialize() {
        // Placeholder for startup work (token fetch, feature flags, config warmup, etc.)
        await sleep(STARTUP_DELAY_MS);

        const { appConfig } = await import("./app-config.js"); // this is just for example, so don't move it to code
        const globalAppConfig = appConfig as AppGlobals;

        // Can customize global values in code too, or fetch via different API calls
        globalAppConfig.theme = { ...globalAppConfig.theme, navbar: { ...globalAppConfig.theme?.navbar, header: "bg-slate-100 border-slate-200" } }
        globalAppConfig.sidebarItems = sidebarItems;
        globalAppConfig.navbarItems = navbarItems;

        return globalAppConfig;
    }

    getIconService(): DefaultIconService {
        return new TestIconService();
    }

    getRouteElements(): Dictionary<ReactElement> {
        return {
            "index": <HomePage />,
            "about": <AboutPage />,
            "settings": <div>Settings page TODO</div>,
            "logout": <div>Logout action TODO</div>,
        };
    }

}

// This is an example of changing the default icons
class TestIconService extends DefaultIconService {
    homeIcon(className = ""): ReactElement {
        const newClassName = `${className}`;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={newClassName} >
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        );
    }
}
