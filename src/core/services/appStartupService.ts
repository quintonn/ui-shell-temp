import type { AppGlobals } from "../types/app";

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

    protected abstract initialize(): Promise<AppGlobals>;
}
