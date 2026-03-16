import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { GearIcon, HomeIcon, InfoIcon, ProfileIcon } from "./icons";
import { useAppGlobals } from "../../state/AppGlobalsContext";
import type { AppIcon, NavbarItem, NavbarSubItem } from "../../types/app";

const NAVBAR_HEADER_SURFACE_CLASS = "bg-white border-slate-200";
const NAVBAR_MENU_SURFACE_CLASS = "bg-white border-slate-200";
const NAVBAR_MENU_CONTAINER_CLASS = "relative";
const NAVBAR_LEFT_ITEMS_CLASS = "hidden items-center gap-1 md:flex";
const NAVBAR_RIGHT_ITEMS_CLASS = "ml-auto flex items-center gap-2";
const NAVBAR_MENU_ITEM_CLASS = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900";
const NAVBAR_ITEM_BASE_CLASS = "flex h-9 items-center rounded-lg text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
const NAVBAR_MENU_TRIGGER_CLASS = "flex h-9 items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
const NAVBAR_ITEM_ICON_CLASS = "h-5 w-5";
const NAVBAR_MENU_ITEM_ICON_CLASS = "h-4 w-4";
const NAVBAR_MENU_TRIGGER_LABEL_CLASS = "text-xs font-medium";
const NAVBAR_MENU_PANEL_CLASS = "absolute right-0 top-11 z-20 min-w-40 overflow-hidden rounded-xl border py-1 shadow-lg shadow-slate-900/10";

function resolveNavIcon(icon?: AppIcon) {
    switch (icon) {
        case "home":
            return <HomeIcon />;
        case "info":
            return <InfoIcon />;
        case "profile":
            return <ProfileIcon />;
        case "gear":
            return <GearIcon />;
        default:
            return null;
    }
}

function itemPaddingClass(hasLabel: boolean) {
    return hasLabel ? "px-2" : "w-9";
}

function navItemLayoutClass(hasLabel: boolean) {
    return hasLabel ? "gap-2" : "justify-center";
}

function navItemClassName(hasLabel: boolean) {
    return `${NAVBAR_ITEM_BASE_CLASS} ${navItemLayoutClass(hasLabel)} ${itemPaddingClass(hasLabel)}`;
}

function navMenuTriggerClassName(hasLabel: boolean) {
    return `${NAVBAR_MENU_TRIGGER_CLASS} ${navItemLayoutClass(hasLabel)} ${itemPaddingClass(hasLabel)}`;
}

export function NavBar() {
    const [openMenuItemId, setOpenMenuItemId] = useState<string | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const { navbarItems, onActionClick } = useAppGlobals();
    const leftItems = navbarItems.filter((item) => item.align !== "right");
    const rightItems = navbarItems.filter((item) => item.align === "right");

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!headerRef.current) {
                return;
            }

            if (!headerRef.current.contains(event.target as Node)) {
                setOpenMenuItemId(null);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpenMenuItemId(null);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    async function handleActionClick(actionId: string) {
        await onActionClick?.(actionId);
        setOpenMenuItemId(null);
    }

    function renderMenuItem(item: NavbarSubItem) {
        const icon = resolveNavIcon(item.icon);
        const content = (
            <>
                {icon ? <span className={NAVBAR_MENU_ITEM_ICON_CLASS}>{icon}</span> : null}
                {item.label ? <span>{item.label}</span> : null}
            </>
        );

        if (item.to) {
            return (
                <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpenMenuItemId(null)}
                    className={NAVBAR_MENU_ITEM_CLASS}
                >
                    {content}
                </NavLink>
            );
        }

        return (
            <button
                key={item.id}
                type="button"
                onClick={() => item.actionId ? void handleActionClick(item.actionId) : undefined}
                className={NAVBAR_MENU_ITEM_CLASS}
            >
                {content}
            </button>
        );
    }

    function renderNavItem(item: NavbarItem) {
        const icon = resolveNavIcon(item.icon);
        const hasLabel = Boolean(item.label);
        const className = navItemClassName(hasLabel);
        const content = (
            <>
                {icon ? <span className={NAVBAR_ITEM_ICON_CLASS}>{icon}</span> : null}
                {item.label ? <span>{item.label}</span> : null}
            </>
        );

        if (item.items && item.items.length > 0) {
            const isOpen = openMenuItemId === item.id;

            return (
                <div key={item.id} className={NAVBAR_MENU_CONTAINER_CLASS}>
                    <button
                        type="button"
                        onClick={() => setOpenMenuItemId((prev) => (prev === item.id ? null : item.id))}
                        className={navMenuTriggerClassName(hasLabel)}
                        aria-label={item.label ?? item.id.toString()}
                        aria-expanded={isOpen}
                    >
                        {icon ? <span className={NAVBAR_ITEM_ICON_CLASS}>{icon}</span> : null}
                        {item.label ? <span className={NAVBAR_MENU_TRIGGER_LABEL_CLASS}>{item.label}</span> : null}
                    </button>

                    {isOpen ? (
                        <div className={`${NAVBAR_MENU_PANEL_CLASS} ${NAVBAR_MENU_SURFACE_CLASS}`}>
                            {item.items.map((menuItem) => renderMenuItem(menuItem))}
                        </div>
                    ) : null}
                </div>
            );
        }

        if (item.to) {
            return (
                <NavLink key={item.id} to={item.to} className={className} aria-label={item.label ?? item.id.toString()}>
                    {content}
                </NavLink>
            );
        }

        return (
            <button
                key={item.id}
                type="button"
                onClick={() => item.actionId ? void handleActionClick(item.actionId) : undefined}
                className={className}
                aria-label={item.label ?? item.id.toString()}
            >
                {content}
            </button>
        );
    }

    return (
        <header ref={headerRef} className={`flex h-14 items-center gap-3 border-b px-4 ${NAVBAR_HEADER_SURFACE_CLASS}`}>
            <div className={NAVBAR_LEFT_ITEMS_CLASS}>
                {leftItems.map((item) => renderNavItem(item))}
            </div>

            <div className={NAVBAR_RIGHT_ITEMS_CLASS}>
                {rightItems.map((item) => renderNavItem(item))}
            </div>
        </header>
    );
}
