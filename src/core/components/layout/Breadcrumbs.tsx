import { NavLink, useLocation } from "react-router-dom";
import { useAppGlobals } from "../../state/AppGlobalsContext";

export function Breadcrumbs() {
    const location = useLocation();
    const { appName } = useAppGlobals();
    const parts = location.pathname.split("/").filter(Boolean);
    const crumbItems = [
        { label: appName, to: "/" },
        ...parts.slice(0, -1).map((_, index) => {
            const path = `/${parts.slice(0, index + 1).join("/")}`;
            const label = parts[index]!.charAt(0).toUpperCase() + parts[index]!.slice(1);
            return { label, to: path };
        }),
        ...(parts.length > 0
            ? [
                {
                    label: parts[parts.length - 1]!.charAt(0).toUpperCase() + parts[parts.length - 1]!.slice(1),
                    to: location.pathname,
                },
            ]
            : []),
    ];

    return (
        <nav aria-label="Breadcrumb" className="mb-1 text-xs">
            <ol className="flex items-center gap-2 text-slate-500">
                {crumbItems.map((item, index) => {
                    const isLast = index === crumbItems.length - 1;

                    return (
                        <li key={`${item.to}-${item.label}`} className="flex items-center gap-2">
                            {index > 0 ? <span className="text-slate-300">/</span> : null}
                            {isLast ? (
                                <span className="font-medium text-slate-700">{item.label}</span>
                            ) : (
                                <NavLink to={item.to} className="hover:text-slate-700">
                                    {item.label}
                                </NavLink>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
