import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { GearIcon, HomeIcon, InfoIcon, ProfileIcon } from "./icons";
import { useAppGlobals } from "../../state/AppGlobalsContext";
import type { AppIcon, NavbarItem, NavbarSubItem } from "../../types/app";

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
        const className = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900";
        const content = (
            <>
                {icon ? <span className="h-4 w-4">{icon}</span> : null}
                {item.label ? <span>{item.label}</span> : null}
            </>
        );

        if (item.to) {
            return (
                <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => setOpenMenuItemId(null)}
                    className={className}
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
                className={className}
            >
                {content}
            </button>
        );
    }

    function renderNavItem(item: NavbarItem) {
        const icon = resolveNavIcon(item.icon);
        const hasLabel = Boolean(item.label);
        const className = `flex h-9 items-center ${hasLabel ? "gap-2" : "justify-center"} rounded-lg ${itemPaddingClass(hasLabel)} text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900`;
        const content = (
            <>
                {icon ? <span className="h-5 w-5">{icon}</span> : null}
                {item.label ? <span>{item.label}</span> : null}
            </>
        );

        if (item.items && item.items.length > 0) {
            const isOpen = openMenuItemId === item.id;

            return (
                <div key={item.id} className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenMenuItemId((prev) => (prev === item.id ? null : item.id))}
                        className={`flex h-9 items-center ${hasLabel ? "gap-2" : "justify-center"} rounded-lg ${itemPaddingClass(hasLabel)} text-slate-600 transition hover:bg-slate-100 hover:text-slate-900`}
                        aria-label={item.label ?? item.id.toString()}
                        aria-expanded={isOpen}
                    >
                        {icon ? <span className="h-5 w-5">{icon}</span> : null}
                        {item.label ? <span className="text-xs font-medium">{item.label}</span> : null}
                    </button>

                    {isOpen ? (
                        <div className="absolute right-0 top-11 z-20 min-w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
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
        <header ref={headerRef} className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
            <div className="hidden items-center gap-1 md:flex">
                {leftItems.map((item) => renderNavItem(item))}
            </div>

            <div className="ml-auto flex items-center gap-2">
                {rightItems.map((item) => renderNavItem(item))}
            </div>
        </header>
    );
}
