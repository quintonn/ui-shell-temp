import { AppStartupService } from "@/core/services/appStartupService";
import { DevAppStartupService } from "@/dev-app/services/devAppStartupService";

const isDevMode = process.env.NODE_ENV !== "production";

export function getAppStartupService(): AppStartupService | null {
    if (isDevMode) {
        return new DevAppStartupService();
    }

    return null; // Replace with actual production AppStartupService implementation when available
}

