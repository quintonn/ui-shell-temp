export const appConfig = {
    appName: "Qbic v2",
    authType: "oidc",
    sidebarItems: [
        { id: "home", label: "Home", to: "/", icon: "home" },
        { id: "about", label: "About", to: "/about", icon: "info" },
    ],
    navbarItems: [
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
            ],
        },
    ],
    layout: {
        includeTopBar: true,
        leftSidebarPlacement: "over-nav",
        rightSidebarPlacement: "under-nav",
        allowSidebarResize: true,
        allowRightSidebarResize: true,
    },
};
