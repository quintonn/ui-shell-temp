import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type RightSidebarState = {
    content: ReactNode | null;
    collapsed: boolean;
};

export type RightSidebarUpdate = {
    content?: ReactNode | null;
    collapsed?: boolean;
};

export const RIGHT_SIDEBAR_UPDATE_EVENT = "app:right-sidebar:update";

export function publishRightSidebarUpdate(update: RightSidebarUpdate) {
    window.dispatchEvent(new CustomEvent<RightSidebarUpdate>(RIGHT_SIDEBAR_UPDATE_EVENT, { detail: update }));
}

type RightSidebarContextValue = {
    rightSidebar: RightSidebarState;
    setRightSidebarContent: (content: ReactNode | null) => void;
    clearRightSidebarContent: () => void;
    setRightSidebarCollapsed: (collapsed: boolean) => void;
    toggleRightSidebarCollapsed: () => void;
};

export const DEFAULT_RIGHT_SIDEBAR: RightSidebarContextValue = {
    rightSidebar: {
        content: null,
        collapsed: false,
    },
    setRightSidebarContent: () => undefined,
    clearRightSidebarContent: () => undefined,
    setRightSidebarCollapsed: () => undefined,
    toggleRightSidebarCollapsed: () => undefined,
};

const RightSidebarContext = createContext<RightSidebarContextValue>(DEFAULT_RIGHT_SIDEBAR);

type RightSidebarProviderProps = {
    children: ReactNode;
};

export function RightSidebarProvider({ children }: RightSidebarProviderProps) {
    const [rightSidebar, setRightSidebar] = useState<RightSidebarState>({
        content: null,
        collapsed: false,
    });

    useEffect(() => {
        function handleRightSidebarUpdate(event: Event) {
            const customEvent = event as CustomEvent<RightSidebarUpdate>;
            const detail = customEvent.detail;

            if (!detail) {
                return;
            }

            setRightSidebar((previous) => ({
                content: detail.content !== undefined ? detail.content : previous.content,
                collapsed: detail.collapsed !== undefined ? detail.collapsed : previous.collapsed,
            }));
        }

        window.addEventListener(RIGHT_SIDEBAR_UPDATE_EVENT, handleRightSidebarUpdate as EventListener);

        return () => {
            window.removeEventListener(RIGHT_SIDEBAR_UPDATE_EVENT, handleRightSidebarUpdate as EventListener);
        };
    }, []);

    const contextValue = useMemo<RightSidebarContextValue>(() => ({
        rightSidebar,
        setRightSidebarContent: (content) => {
            setRightSidebar((previous) => ({ ...previous, content }));
        },
        clearRightSidebarContent: () => {
            setRightSidebar((previous) => ({ ...previous, content: null }));
        },
        setRightSidebarCollapsed: (collapsed) => {
            setRightSidebar((previous) => ({ ...previous, collapsed }));
        },
        toggleRightSidebarCollapsed: () => {
            setRightSidebar((previous) => ({ ...previous, collapsed: !previous.collapsed }));
        },
    }), [rightSidebar]);

    return (
        <RightSidebarContext.Provider value={contextValue}>
            {children}
        </RightSidebarContext.Provider>
    );
}

export function useRightSidebar() {
    return useContext(RightSidebarContext);
}
