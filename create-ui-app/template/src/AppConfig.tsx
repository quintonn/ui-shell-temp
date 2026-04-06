import { bootstrapApp, CachedAppStartupService, type AppGlobals, type NavbarItem, type SidebarItem, type UIService } from "@quintonn/ui-app";
import { __APP_PASCAL_NAME__UIService } from "@/services/__APP_CAMEL_NAME__UIService.tsx";

const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Home", to: "/", icon: "home" },
    { id: "about", label: "About", to: "/about", icon: "info" },
    { id: "inventory", label: "Inventory", to: "/inventory", icon: "gear" },
];

const navbarItems: NavbarItem[] = [
    {
        id: "profile",
        label: "Profile",
        icon: "profile",
        align: "right",
        items: [
            { id: "profile-view", label: "Profile", to: "/profile" },
            { id: "profile-logout", label: "Logout", to: "/logout" },
        ]
    },
];

class __APP_PASCAL_NAME__StartupService extends CachedAppStartupService {
    protected async initialize(): Promise<AppGlobals> {
        return {
            appName: "__PROJECT_TITLE__",
            authType: "none",
            sidebarItems: sidebarItems,
            navbarItems: navbarItems,
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
        return new __APP_PASCAL_NAME__UIService();
    }
}

bootstrapApp(new __APP_PASCAL_NAME__StartupService());