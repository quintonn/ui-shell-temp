import type { AppGlobals } from "../types/app";
import { DefaultIconService } from "./iconService";

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

    protected abstract initialize(): Promise<AppGlobals>;
}
