import { AboutPage } from "@/app/pages/AboutPage";
import { HomePage } from "@/app/pages/HomePage";
import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider } from "@/core/state/AppGlobalsContext";
import { RightSidebarProvider, useRightSidebar } from "@/core/state/RightSidebarContext";
import { AppGlobals, Dictionary, NavbarItem, NavbarMenuItem, NavbarSubItem, SidebarItem } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";



const menuMapper: Dictionary<React.ReactElement> = {
    "about": <AboutPage />,
    "settings": (<div>Settings page TODO</div>),
    "logout": (<div>Logout action TODO</div>),
};

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

const allRouteItems: string[] = [];

for (const item in sidebarItems) {
    if (sidebarItems[item]?.to) {
        allRouteItems.push(sidebarItems[item]?.to);
    }
}
for (const item in navbarItems) {
    if (navbarItems[item]?.to) {
        allRouteItems.push(navbarItems[item].to);
    } else if (navbarItems[item]?.items) {
        for (const subItem of navbarItems[item].items) {
            allRouteItems.push(subItem.to);
        }
    }
}

function AppContent() {
    const { setRightSidebarContent } = useRightSidebar();

    useEffect(() => {
        setTimeout(() => {
            setRightSidebarContent(<AboutPage />);
        }, 1000);
    }, []);

    return (
        <main className="h-dvh w-full overflow-hidden">
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    {allRouteItems.map((path) => {
                        const Component = menuMapper[path.replace("/", "")] || <div>{`Page for ${path} TODO`}</div>;
                        return <Route key={path} path={path} element={Component} />;
                    })}
                    <Route path="*" element={<div>Unknown path</div>} />
                </Route>
            </Routes>
        </main>
    );
}

export function App({ globals, iconService }: { globals: AppGlobals; iconService?: DefaultIconService }) {
    return (
        <AppGlobalsProvider value={{ ...globals, sidebarItems, navbarItems }} iconService={iconService}>
            <RightSidebarProvider>
                <AppContent />
            </RightSidebarProvider>
        </AppGlobalsProvider>
    );
}

