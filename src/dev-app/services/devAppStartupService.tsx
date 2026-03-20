import { CachedAppStartupService, UIService } from "@/core/services/appStartupService";
import { DefaultIconService } from "@/core/services/iconService.js";
import { type AppGlobals, type NavbarItem, type SidebarItem } from "@/core/types/app";
import { DevUIService } from "@/dev-app/services/devUIService";
import { DevIconService } from "@/dev-app/services/devIconService";

const STARTUP_DELAY_MS = 1000;

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Home", to: "/", icon: "home" },
    { id: "about", label: "About", to: "/about", icon: "info" },
    { id: "inventory", label: "Inventory", to: "/inventory", icon: "gear" },
];

const navbarItems: NavbarItem[] = [
    { id: "config", label: "Config", to: "/config", align: "left" },
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
    getUIService(): UIService {
        return new DevUIService();
    }
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
        return new DevIconService();
    }

    onReady(): void {
        // Example: console.log("App is ready!");
    }

}


