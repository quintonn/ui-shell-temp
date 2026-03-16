import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider, useAppGlobals } from "@/core/state/AppGlobalsContext";
import { RightSidebarProvider } from "@/core/state/RightSidebarContext";
import { type AppGlobals, type Dictionary } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { Route, Routes } from "react-router-dom";
import { type ReactElement } from "react";



function AppContent({ routeElements }: { routeElements: Dictionary<ReactElement> }) {
    const { sidebarItems, navbarItems } = useAppGlobals();

    // Calculate allRouteItems from globals
    const allRouteItems: string[] = (() => {
        const items: string[] = [];

        for (const item in sidebarItems) {
            if (sidebarItems[item]?.to) {
                items.push(sidebarItems[item]?.to);
            }
        }
        for (const item in navbarItems) {
            if (navbarItems[item]?.to) {
                items.push(navbarItems[item].to);
            } else if (navbarItems[item]?.items) {
                for (const subItem of navbarItems[item].items) {
                    items.push(subItem.to);
                }
            }
        }

        return items;
    })();

    return (
        <main className="h-dvh w-full overflow-hidden">
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={routeElements["index"]} />
                    {allRouteItems.map((path) => {
                        return <Route key={path} path={path} element={routeElements[path.replace("/", "")]} />;
                    })}
                    <Route path="*" element={<div>Unknown path</div>} />
                </Route>
            </Routes>
        </main>
    );
}

export function App({ globals, iconService, routeElements }: { globals: AppGlobals; iconService?: DefaultIconService; routeElements: Dictionary<ReactElement> }) {
    return (
        <AppGlobalsProvider value={globals} iconService={iconService}>
            <RightSidebarProvider>
                <AppContent routeElements={routeElements} />
            </RightSidebarProvider>
        </AppGlobalsProvider>
    );
}

