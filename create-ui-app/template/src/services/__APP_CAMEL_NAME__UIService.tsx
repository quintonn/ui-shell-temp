import type { Dictionary, UIService } from "@quintonn/ui-app";
import { type ReactElement } from "react";
import { HomePage } from "@/pages/HomePage";

export class __APP_PASCAL_NAME__UIService implements UIService {
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
            "logout": <div>Logout action TODO</div>,
        };
    }

    getBootstrapComponent() {
        return null;
    }
}