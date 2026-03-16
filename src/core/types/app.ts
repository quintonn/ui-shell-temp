type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [Key in Keys]-?: Required<Pick<T, Key>> & Partial<Pick<T, Exclude<Keys, Key>>>;
    }[Keys];

export type AuthType = "none" | "basic" | "oidc" | "saml";

export type AppIcon = "home" | "info" | "gear" | "profile";

export type NavbarAlign = "left" | "right";

export type SidebarPlacement = "hidden" | "over-nav" | "under-nav";


export type LayoutConfig = {
    includeTopBar: boolean;
    leftSidebarPlacement: SidebarPlacement;
    rightSidebarPlacement: SidebarPlacement;
    allowSidebarResize: boolean;
    allowRightSidebarResize: boolean;
};

export type SidebarItem = {
    id: string;
    label: string;
    icon?: AppIcon;
    to: string;
};

export type NavbarSubItem = {
    id: string;
    label?: string;
    icon?: AppIcon;
    to: string;
};

type NavbarBaseItem = {
    id: string;
    label?: string;
    icon?: AppIcon;
    align?: NavbarAlign;
};

export type NavbarMenuItem = NavbarBaseItem & {
    items: NavbarSubItem[];
    to: never;
};

export type NavbarLinkItem = NavbarBaseItem & {
    items?: never;
    to: string;
};

export type NavbarItem = NavbarMenuItem | NavbarLinkItem;

export type NavbarTheme = {
    header?: string;
    item?: string;
    menuItem?: string;
    menuTriggerLabel?: string;
    menuPanel?: string;
};

export type AppTheme = {
    navbar?: NavbarTheme;
};

export type AppGlobals = {
    appName: string;
    authType: AuthType;
    sidebarItems: SidebarItem[];
    navbarItems: NavbarItem[];
    layout: LayoutConfig;
    theme?: AppTheme;
};