import type { AppGlobals, Dictionary } from "../types/app";
import { DefaultIconService } from "./iconService";
import type { ReactElement } from "react";

export interface AppStartupService {
    run(): Promise<AppGlobals>;
}

export abstract class CachedAppStartupService implements AppStartupService {
    private startupPromise: Promise<AppGlobals> | null = null;

    run() {
        if (!this.startupPromise) {
            this.startupPromise = this.initialize();
        }

        return this.startupPromise;
    }

    getIconService(): DefaultIconService {
        return new DefaultIconService();
    }

    getRouteElements(): Dictionary<ReactElement> {
        return {};
    }

    getBootstrapComponent(): (() => null) | null {
        return null;
    }

    onReady(): void {
        // Override to run code after the app has mounted
    }

    protected abstract initialize(): Promise<AppGlobals>;
}
