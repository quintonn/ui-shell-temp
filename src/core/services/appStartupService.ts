import type { AppGlobals, Dictionary } from "../types/app";
import { DefaultIconService } from "./iconService";
import type { ReactElement } from "react";

export interface AppStartupService {
    run(): Promise<AppGlobals>;
}

export interface UIService {
    getPageTitle(path: string): Promise<string>;
    getRouteElements(): Dictionary<ReactElement>;
    getBootstrapComponent(): (() => null) | null;
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

    onReady(): void {
        // Override to run code after the app has mounted
    }

    protected abstract initialize(): Promise<AppGlobals>;

    abstract getUIService(): UIService;
}
