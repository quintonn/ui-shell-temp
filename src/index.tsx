import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalStartupSpinner } from "@/core/components/GlobalStartupSpinner";
import { AppGlobals } from "@/core/types/app";
import type { AppStartupService } from "@/core/services/appStartupService";
import { App } from "@/app/App";

import "./index.css";
import { DEFAULT_APP_GLOBALS } from "@/core/state/AppGlobalsContext";
import { getAppStartupService } from "@/app-config";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element with id 'root' was not found.");
}

const appStartupService: AppStartupService | null = getAppStartupService();

function StartupGate() {
    const [globals, setGlobals] = React.useState<AppGlobals | null>(null);

    React.useEffect(() => {
        let isActive = true;

        if (appStartupService) {
            appStartupService.run().then((startupGlobals) => {
                if (isActive) {
                    setGlobals(startupGlobals);
                }
            });
        } else {
            setGlobals(DEFAULT_APP_GLOBALS);
        }
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
