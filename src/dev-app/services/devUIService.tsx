import { Dictionary } from "@/bootstrapper";
import { UIService } from "@/core/services/appStartupService";
import { useRightSidebar } from "@/core/state/RightSidebarContext";
import { AboutPage } from "@/dev-app/pages/AboutPage";
import { HomePage } from "@/dev-app/pages/HomePage";
import { InventoryPage } from "@/dev-app/pages/InventoryPage";
import { InventoryDetailPage } from "@/dev-app/pages/InventoryDetailPage";
import { ReactElement, useEffect } from "react";

export class DevUIService implements UIService {
    private mockInventoryData: Record<string, { name: string; sku: string }> = {
        "1": { name: "Laptop", sku: "LAP-001" },
        "2": { name: "Monitor", sku: "MON-001" },
        "3": { name: "Keyboard", sku: "KEY-001" },
        "4": { name: "Mouse", sku: "MOU-001" },
        "5": { name: "USB Cable", sku: "USB-001" },
    };

    private async mockFetchInventoryItem(id: string): Promise<{ name: string; sku: string } | null> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate API call - in real app, this would be: fetch(`/api/inventory/${id}`)
        return this.mockInventoryData[id] || null;
    }

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
                if (cleanPath.startsWith("inventory/")) {
                    const itemId = cleanPath.split("/")[1]!;
                    // Call the mock API to fetch the actual item name
                    return this.mockFetchInventoryItem(itemId).then(item =>
                        item ? item.name : "Unknown Item"
                    );
                }
                return Promise.resolve("Unknown Path: " + cleanPath);
        }
    }

    getRouteElements(): Dictionary<ReactElement> {
        return {
            "index": <HomePage />,
            "about": <AboutPage />,
            "inventory": <InventoryPage />,
            "inventory/:id": <InventoryDetailPage />,
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