import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { GlobalStartupSpinner } from "./core/components/GlobalStartupSpinner";
import { runAppStartupService } from "./core/services/appStartupService";
import type { AppGlobals } from "./core/types/app";
import "./index.css";

const tailwindRuntimeStyleId = "tailwind-runtime-input";
if (!document.getElementById(tailwindRuntimeStyleId)) {
    const style = document.createElement("style");
    style.id = tailwindRuntimeStyleId;
    style.setAttribute("type", "text/tailwindcss");
    style.textContent = '@import "tailwindcss";';
    document.head.appendChild(style);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element with id 'root' was not found.");
}

function StartupGate() {
    const [globals, setGlobals] = React.useState<AppGlobals | null>(null);

    React.useEffect(() => {
        let isActive = true;

        runAppStartupService().then((startupGlobals) => {
            if (isActive) {
                setGlobals(startupGlobals);
            }
        });

        return () => {
            isActive = false;
        };
    }, []);

    if (!globals) {
        return <GlobalStartupSpinner />;
    }

    return (
        <BrowserRouter>
            <App globals={globals} />
        </BrowserRouter>
    );
}

createRoot(rootElement).render(
    <React.StrictMode>
        <StartupGate />
    </React.StrictMode>
);
