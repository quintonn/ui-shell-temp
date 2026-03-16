import { NavLink } from "react-router-dom";
import { Panel, Separator } from "react-resizable-panels";
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon, InfoIcon } from "./icons";
import { SidebarLink } from "./SidebarLink";
import { useAppGlobals } from "../../state/AppGlobalsContext";
import type { AppIcon, SidebarItem } from "../../types/app";

type ResizeHandleProps = {
    disabled?: boolean;
    className?: string;
    toggleCollapsed?: boolean;
    onToggle?: () => void;
};

export function ResizeHandle({ disabled, toggleCollapsed, onToggle }: ResizeHandleProps) {
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
                    {toggleCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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

function resolveSidebarIcon(icon: AppIcon | undefined) {
    switch (icon) {
        case "info":
            return <InfoIcon />;
        case "home":
        default:
            return <HomeIcon />;
    }
}

export function Sidebar({ collapsed, items, appName }: { collapsed: boolean; items: SidebarItem[]; appName: string }) {
    const { onActionClick } = useAppGlobals();

    return (
        <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-slate-100 to-slate-50 p-4">
            <div className="mb-2 flex justify-center pt-2">
                <NavLink
                    to="/"
                    end
                    aria-label={appName}
                    className="grid h-11 w-11 place-items-center rounded-2xl text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-900"
                >
                    <HomeIcon />
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
                        onClick={item.actionId ? () => void onActionClick?.(item.actionId!) : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export function RightSidebar({ disabled }: { disabled?: boolean }) {
    return (
        <Panel
            disabled={disabled}
            defaultSize="22%"
            minSize="15%"
            collapsible
            collapsedSize="0%"
            className="min-w-0 border-l border-slate-200 bg-white p-4"
        >
            right sidebar
        </Panel>
    );
}
