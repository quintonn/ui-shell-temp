export const appConfig = {
    appName: "Qbic v2",
    authType: "oidc",
    sidebarBrand: {
        to: "/",
        imageSrc: new URL("../assets/tractor.png", import.meta.url).toString(),
        alt: "Qbic Tractor",
    },
    layout: {
        includeTopBar: true,
        leftSidebarPlacement: "over-nav",
        rightSidebarPlacement: "under-nav",
        allowSidebarResize: true,
        allowRightSidebarResize: true,
    },
};
