import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider, useAppGlobals } from "@/core/state/AppGlobalsContext";
import { RightSidebarProvider } from "@/core/state/RightSidebarContext";
import { type AppGlobals, type Dictionary } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { Route, Routes, useLocation } from "react-router-dom";
import { type ReactElement, useEffect, useState } from "react";
import { UIService } from "@/core/services/appStartupService";

type AppContentProps = {
    routeElements: Dictionary<ReactElement>;
    uiService: UIService;
    onReady?: () => void;
};

function AppContent({ routeElements, uiService, onReady }: AppContentProps) {
    const { sidebarItems, navbarItems } = useAppGlobals();
    const [title, setTitle] = useState<string>("home");
    const location = useLocation();

    const getTitle = async (): Promise<void> => {
        console.log("location changed:");
        console.log(location)
        const title = await uiService.getPageTitle(location.pathname);
        setTitle(title);
    }

    useEffect(() => {
        console.log("location changed:");
        console.log(location)
        getTitle();
    }, [location])

    useEffect(() => {
        onReady?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return (
        <main className="h-dvh w-full overflow-hidden">
            <Routes>
                <Route path="/" element={<MainLayout title={title} />}>
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

