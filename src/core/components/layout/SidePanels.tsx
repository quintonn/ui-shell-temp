import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { Panel, Separator, type PanelImperativeHandle } from "react-resizable-panels";
import { SidebarLink } from "@/core/components/layout/SidebarLink";
import { useAppGlobals } from "@/core/state/AppGlobalsContext";
import type { AppIcon, SidebarItem } from "@/core/types/app";

type ResizeHandleProps = {
    disabled?: boolean;
    className?: string;
    toggleCollapsed?: boolean;
    onToggle?: () => void;
};

export function ResizeHandle({ disabled, toggleCollapsed, onToggle }: ResizeHandleProps) {
    const { iconService } = useAppGlobals();
    const separatorStateClass = `outline-none transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-0${disabled ? " pointer-events-none" : " hover:bg-slate-300 active:bg-slate-400"}`;

    if (typeof toggleCollapsed === "boolean" && onToggle) {
        return (
            <div className="relative h-full w-1 shrink-0 bg-slate-200/80">
                {!toggleCollapsed ? <Separator disabled={disabled} className={`absolute inset-y-0 left-0 h-full !w-full bg-transparent ${separatorStateClass}`} /> : null}
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={toggleCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="absolute left-1/2 top-20 z-50 grid h-8 w-8 -translate-x-1/2 !cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                    {toggleCollapsed ? iconService.chevronRightIcon("size-4 pointer-events-none") : iconService.chevronLeftIcon("size-4 pointer-events-none")}
                </button>
            </div>
        );
    }

    return (
        <Separator
            disabled={disabled}
            className={`w-1 bg-slate-200/80 ${separatorStateClass}`}
        />
    );
}

export function Sidebar({ collapsed, items, appName }: { collapsed: boolean; items: SidebarItem[]; appName: string }) {
    const { iconService } = useAppGlobals();

    function resolveSidebarIcon(icon: AppIcon | undefined) {
        switch (icon) {
            case "info":
                return iconService.infoIcon("size-6");
            case "home":
            default:
                return iconService.homeIcon("size-6");
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-slate-100 to-slate-50 p-4">
            <div className="mb-2 flex justify-center pt-2">
                <NavLink
                    to="/"
                    end
                    aria-label={appName}
                    className="grid h-11 w-11 place-items-center rounded-2xl text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-900"
                >
                    {iconService.homeIcon("size-6")}
                </NavLink>
            </div>

            <div className="space-y-2">
                {items.map((item) => (
                    <SidebarLink
                        key={item.id}
                        label={item.label}
                        icon={resolveSidebarIcon(item.icon)}
                        collapsed={collapsed}
                        to={item.to}
                    />
                ))}
            </div>
        </div>
    );
}

type RightSidebarProps = {
    disabled?: boolean;
    panelRef?: React.RefObject<PanelImperativeHandle | null>;
    content?: ReactNode;
    onResize?: (size: { inPixels: number }) => void;
};

export function RightSidebar({ disabled, panelRef, content, onResize }: RightSidebarProps) {
    return (
        <Panel
            panelRef={panelRef}
            disabled={disabled}
            defaultSize="22%"
            minSize="15%"
            collapsible
            collapsedSize="0%"
            onResize={onResize}
            className="min-w-0 border-l border-slate-200 bg-white p-4"
        >
            {content}
        </Panel>
    );
}
