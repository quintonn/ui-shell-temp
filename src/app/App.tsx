import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider, useAppGlobals } from "@/core/state/AppGlobalsContext";
import { RightSidebarProvider } from "@/core/state/RightSidebarContext";
import { type AppGlobals, type Dictionary } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { type ReactElement, useEffect, useState } from "react";
import { UIService } from "@/core/services/appStartupService";
import { Routes } from "react-router";
import { Route } from "react-router";
import { useLocation } from "react-router";

type AppContentProps = {
    routeElements: Dictionary<ReactElement>;
    uiService: UIService;
    onReady?: () => void;
};

function AppContent({ routeElements, uiService, onReady }: AppContentProps) {
    const { sidebarItems, navbarItems } = useAppGlobals();
    const [title, setTitle] = useState<string>("home");
    const [isTitleLoading, setIsTitleLoading] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        let isCurrent = true;

        // Clear stale title immediately so only the loader is shown while fetching.
        setTitle("");
        setIsTitleLoading(true);
        uiService.getPageTitle(location.pathname)
            .then((nextTitle) => {
                if (!isCurrent) {
                    return;
                }
                setTitle(nextTitle);
            })
            .finally(() => {
                if (!isCurrent) {
                    return;
                }
                setIsTitleLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, [location.pathname, uiService]);

    useEffect(() => {
        onReady?.();
    }, []);

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

    // Get all dynamic routes from routeElements that aren't navigation items
    const dynamicRoutes: string[] = (() => {
        const navigationRoutes = new Set(allRouteItems.map(p => p.replace(/^\//, "")));
        const dynamic: string[] = [];

        for (const key in routeElements) {
            if (key !== "index" && !navigationRoutes.has(key)) {
                dynamic.push(key);
            }
        }

        return dynamic;
    })();

    return (
        <main className="h-dvh w-full overflow-hidden">
            <Routes>
                <Route path="/" element={<MainLayout title={title} isTitleLoading={isTitleLoading} />}>
                    <Route index element={routeElements["index"]} />
                    {allRouteItems.map((path) => {
                        return <Route key={path} path={path} element={routeElements[path.replace("/", "")]} />;
                    })}
                    {dynamicRoutes.map((path) => {
                        return <Route key={path} path={path} element={routeElements[path]} />;
                    })}
                    <Route path="*" element={<div>Unknown path: {location.pathname}</div>} />
                </Route>
            </Routes>
        </main>
    );
}

type AppProps = {
    globals: AppGlobals;
    iconService?: DefaultIconService;
    uiService: UIService;
    routeElements: Dictionary<ReactElement>;
    bootstrapComponent?: (() => null) | null;
    onReady?: () => void;
};

export function App({ globals, iconService, uiService, routeElements, bootstrapComponent: BootstrapComponent, onReady }: AppProps) {
    return (
        <AppGlobalsProvider value={globals} iconService={iconService}>
            <RightSidebarProvider>
                {BootstrapComponent ? <BootstrapComponent /> : null}
                <AppContent uiService={uiService} routeElements={routeElements} onReady={onReady} />
            </RightSidebarProvider>
        </AppGlobalsProvider>
    );
}

