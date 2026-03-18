import { Dictionary } from "@/bootstrapper";
import { UIService } from "@/core/services/appStartupService";
import { useRightSidebar } from "@/core/state/RightSidebarContext";
import { AboutPage } from "@/dev-app/pages/AboutPage";
import { HomePage } from "@/dev-app/pages/HomePage";
import { ReactElement, useEffect } from "react";

export class DevUIService implements UIService {
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
            case "settings":
                return Promise.resolve("Settings");
            default:
                return Promise.resolve("Unknown Path: " + cleanPath);
        }
    }

    getRouteElements(): Dictionary<ReactElement> {
        return {
            "index": <HomePage />,
            "about": <AboutPage />,
            "settings": <div>Settings page TODO</div>,
            "logout": <div>Logout action TODO</div>,
        };
    }

    // this method essentially allows us to mount a component when the app has loaded
    // allowing us to perform UI effects, call APIs etc.
    // The difference between the onReady is that we can use hooks here.
    getBootstrapComponent() {
        return function DevAppBootstrap() {
            const { setRightSidebarContent, clearRightSidebarContent } = useRightSidebar();

            // just a test/example
            useEffect(() => {
                setTimeout(() => {
                    setRightSidebarContent(<AboutPage />);
                }, 1000)

                setTimeout(() => {
                    clearRightSidebarContent();
                }, 3000)

            }, []);

            return null;
        };
    }
}