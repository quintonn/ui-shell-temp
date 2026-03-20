type PreferenceMap = Record<string, unknown>;
type PreferencesClass<T> = new () => T;

const DEFAULT_STORAGE_KEY = "ui-app.user-preferences.v1";

function canUseStorage(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isObject(value: unknown): value is PreferenceMap {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class UserPreferencesStore<T extends object> {
    constructor(
        private readonly preferencesClass: PreferencesClass<T>,
        private readonly storageKey: string = DEFAULT_STORAGE_KEY,
    ) { }

    get(): T {
        const preferences = new this.preferencesClass();

        if (!canUseStorage()) {
            return preferences;
        }

        try {
            const rawValue = window.localStorage.getItem(this.storageKey);
            if (!rawValue) {
                return preferences;
            }

            const parsedValue: unknown = JSON.parse(rawValue);
            if (!isObject(parsedValue)) {
                return preferences;
            }

            Object.assign(preferences as object, parsedValue);
            return preferences;
        } catch {
            return preferences;
        }
    }

    set(preferences: T): void {
        if (!canUseStorage()) {
            return;
        }

        try {
            window.localStorage.setItem(this.storageKey, JSON.stringify(preferences));
        } catch {
            // Ignore storage write failures (private mode, quota exceeded, etc.)
        }
    }
}

export type SidebarState = "expanded" | "collapsed";

export class AppUserPreferences {
    private _leftSidebarState: SidebarState = "expanded";

    public get leftSidebarState(): SidebarState {
        return this._leftSidebarState;
    }

    public set leftSidebarState(value: SidebarState) {
        this._leftSidebarState = value === "collapsed" ? "collapsed" : "expanded";
    }

    public get leftSidebarCollapsed(): boolean {
        return this._leftSidebarState === "collapsed";
    }

    public set leftSidebarCollapsed(value: boolean) {
        this._leftSidebarState = value ? "collapsed" : "expanded";
    }

    public toJSON() {
        return {
            leftSidebarState: this._leftSidebarState,
        };
    }
}

export const appUserPreferencesStore = new UserPreferencesStore(AppUserPreferences);
