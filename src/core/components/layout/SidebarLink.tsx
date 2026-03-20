import { NavLink } from "react-router";
import { type ReactNode } from "react";

type SidebarLinkProps = {
    label: string;
    icon: ReactNode;
    collapsed: boolean;
    to: string;
};

export function SidebarLink({ label, icon, collapsed, to }: SidebarLinkProps) {
    const buildClassName = (isActive: boolean) =>
        [
            "flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition",
            collapsed ? "justify-center" : "gap-2",
            isActive
                ? "bg-indigo-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-indigo-200 hover:text-slate-900",
        ].join(" ");

    const content = (
        <>
            <span className="shrink-0">{icon}</span>
            {collapsed ? null : <span>{label}</span>}
        </>
    );


    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) => buildClassName(isActive)}
            title={collapsed ? label : undefined}
        >
            {content}
        </NavLink>
    );
}
