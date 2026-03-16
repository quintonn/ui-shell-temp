import { CachedAppStartupService } from "@/core/services/appStartupService";
import { type AppGlobals } from "@/core/types/app";

const STARTUP_DELAY_MS = 1000;

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

export class DevAppStartupService extends CachedAppStartupService {
    protected async initialize() {
        // Placeholder for startup work (token fetch, feature flags, config warmup, etc.)
        await sleep(STARTUP_DELAY_MS);

        const { appConfig } = await import("./app-config.js");
        const globalAppConfig = appConfig as AppGlobals;

        // Can customize global values in code too, or fetch via different API calls
        globalAppConfig.theme = { ...globalAppConfig.theme, navbar: { ...globalAppConfig.theme?.navbar, header: "bg-slate-100 border-slate-200" } }

        return globalAppConfig;
    }
}
