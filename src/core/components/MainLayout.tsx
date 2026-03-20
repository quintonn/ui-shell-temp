import { useEffect, useRef, useState } from "react";
import { Group, Panel, type PanelImperativeHandle } from "react-resizable-panels";
import { Breadcrumbs } from "@/core/components/layout/Breadcrumbs";
import { NavBar } from "@/core/components/layout/NavBar";
import { ResizeHandle, RightSidebar, Sidebar } from "@/core/components/layout/SidePanels";
import { useAppGlobals } from "@/core/state/AppGlobalsContext";
import { useRightSidebar } from "@/core/state/RightSidebarContext";
import { appUserPreferencesStore } from "@/core/services/userPreferences";
import { Outlet } from "react-router";

const TITLE_SHIMMER_KEYFRAMES = `
@keyframes uiAppTitleShimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(180%);
    }
}
`;

type ContentAreaProps = {
    title: string;
    isTitleLoading: boolean;
}
function ContentArea({ title, isTitleLoading }: ContentAreaProps) {
    return (
        <main className="h-full min-h-0 flex-1 overflow-hidden bg-slate-50">
            <div className="mx-auto flex h-full min-h-0 flex-col bg-white p-2 md:p-4 shadow-sm">
                <Breadcrumbs />
                <div className="min-h-0 flex-1 overflow-auto">
                    <style>{TITLE_SHIMMER_KEYFRAMES}</style>
                    <section className="flex h-full flex-col gap-3">
                        <div className="min-h-12">
                            {isTitleLoading ? (
                                <div
                                    className="relative h-10 w-56 overflow-hidden rounded-md bg-slate-200/90"
                                    role="status"
                                    aria-label="Loading title"
                                >
                                    <span
                                        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/85 to-transparent"
                                        style={{ animation: "uiAppTitleShimmer 1.25s ease-in-out infinite" }}
                                    />
                                </div>
                            ) : (
                                <div className="text-3xl font-bold leading-tight text-slate-950">{title}</div>
                            )}
                        </div>
                        <Outlet />
                    </section>
                </div>
            </div>
        </main>
    );
}
export type MainLayoutProps = {
    title: string;
    isTitleLoading: boolean;
}
export function MainLayout({ title, isTitleLoading }: MainLayoutProps) {
    const { appName, layout, sidebarItems } = useAppGlobals();
    const { rightSidebar, setRightSidebarCollapsed } = useRightSidebar();

    const includeTopBar = layout.includeTopBar;

    const showLeftSidebar = layout.leftSidebarPlacement !== "hidden";
    const showRightSidebar = layout.rightSidebarPlacement !== "hidden";
    const leftSidebarOverNavBar = layout.leftSidebarPlacement === "over-nav";
    const rightSidebarOverNavBar = layout.rightSidebarPlacement === "over-nav";

    const preferencesRef = useRef(appUserPreferencesStore.get());
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(preferencesRef.current.leftSidebarCollapsed);
    const leftSidebarPanelRef = useRef<PanelImperativeHandle | null>(null);
    const rightSidebarPanelRef = useRef<PanelImperativeHandle | null>(null);

    useEffect(() => {
        if (!showLeftSidebar || !leftSidebarPanelRef.current) {
            return;
        }

        if (isLeftSidebarCollapsed) {
            leftSidebarPanelRef.current.collapse();
        } else {
            leftSidebarPanelRef.current.expand();
        }
    }, [isLeftSidebarCollapsed, showLeftSidebar]);

    useEffect(() => {
        preferencesRef.current.leftSidebarCollapsed = isLeftSidebarCollapsed;
        appUserPreferencesStore.set(preferencesRef.current);
    }, [isLeftSidebarCollapsed]);

    function toggleLeftSidebar() {
        if (!leftSidebarPanelRef.current) return;
        if (isLeftSidebarCollapsed) {
            setIsLeftSidebarCollapsed(false);
            leftSidebarPanelRef.current.expand();
        } else {
            setIsLeftSidebarCollapsed(true);
            leftSidebarPanelRef.current.collapse();
        }
    }

    const leftPanel = showLeftSidebar ? (
        <Panel
            panelRef={leftSidebarPanelRef}
            disabled={!layout.allowSidebarResize}
            defaultSize="10%"
            minSize="200px"
            collapsible
            collapsedSize="72px"
            className="min-w-0"
            onResize={(size) => setIsLeftSidebarCollapsed(size.inPixels <= 72)}
        >
            <Sidebar collapsed={isLeftSidebarCollapsed} items={sidebarItems} appName={appName} />
        </Panel>
    ) : null;

    const leftSidebarSection = showLeftSidebar ? (
        <>
            {leftPanel}
            <ResizeHandle toggleCollapsed={isLeftSidebarCollapsed} onToggle={toggleLeftSidebar} />
        </>
    ) : null;

    const rightSidebarDisabled = !layout.allowRightSidebarResize;

    useEffect(() => {
        if (!showRightSidebar || !rightSidebarPanelRef.current || !rightSidebar.content) {
            return;
        }

        if (rightSidebar.collapsed) {
            rightSidebarPanelRef.current.collapse();
        } else {
            rightSidebarPanelRef.current.expand();
        }
    }, [rightSidebar.collapsed, rightSidebar.content, showRightSidebar]);

    const contentSection = showRightSidebar && rightSidebar.content ? (
        <Group orientation="horizontal" className="h-full w-full">
            <Panel className="min-w-0">
                <ContentArea title={title} isTitleLoading={isTitleLoading} />
            </Panel>
            <ResizeHandle disabled={rightSidebarDisabled} />
            <RightSidebar
                panelRef={rightSidebarPanelRef}
                disabled={rightSidebarDisabled}
                content={rightSidebar.content}
                onResize={(size) => setRightSidebarCollapsed(size.inPixels <= 1)}
            />
        </Group>
    ) : (
        <ContentArea title={title} isTitleLoading={isTitleLoading} />
    );

    if (leftSidebarOverNavBar) {
        // Left sidebar spans full height alongside the navbar.
        // When rightSidebarOverNavBar=true, the right sidebar also spans full height,
        // so we nest a horizontal group inside the right panel.
        const rightPanelContent = showRightSidebar && rightSidebarOverNavBar ? (
            <Group orientation="horizontal" className="h-full w-full">
                <Panel className="min-w-0">
                    <div className="flex h-full min-h-0 flex-col bg-white">
                        {includeTopBar && <NavBar />}
                        <ContentArea title={title} isTitleLoading={isTitleLoading} />
                    </div>
                </Panel>
                <ResizeHandle disabled={rightSidebarDisabled} />
                <RightSidebar
                    panelRef={rightSidebarPanelRef}
                    disabled={rightSidebarDisabled}
                    content={rightSidebar.content}
                    onResize={(size) => setRightSidebarCollapsed(size.inPixels <= 1)}
                />
            </Group>
        ) : (
            <div className="flex h-full min-h-0 flex-col bg-white">
                {includeTopBar && <NavBar />}
                <div className="min-h-0 flex-1">{contentSection}</div>
            </div>
        );

        return (
            <Group orientation="horizontal" className="h-full w-full">
                {leftSidebarSection}
                <Panel className="min-w-0">{rightPanelContent}</Panel>
            </Group>
        );
    }

    // Navbar spans full width above the layout.
    // If rightSidebarOverNavBar is true, the right sidebar should span the full height,
    // including beside the navbar area.
    if (showRightSidebar && rightSidebarOverNavBar) {
        return (
            <Group orientation="horizontal" className="h-full w-full">
                <Panel className="min-w-0">
                    <div className="flex h-full min-h-0 flex-col bg-white">
                        {includeTopBar && <NavBar />}
                        <div className="min-h-0 flex-1">
                            <Group orientation="horizontal" className="h-full w-full">
                                {leftSidebarSection}
                                <Panel className="min-w-0">
                                    <ContentArea title={title} isTitleLoading={isTitleLoading} />
                                </Panel>
                            </Group>
                        </div>
                    </div>
                </Panel>
                <ResizeHandle disabled={rightSidebarDisabled} />
                <RightSidebar
                    panelRef={rightSidebarPanelRef}
                    disabled={rightSidebarDisabled}
                    content={rightSidebar.content}
                    onResize={(size) => setRightSidebarCollapsed(size.inPixels <= 1)}
                />
            </Group>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col bg-white">
            {includeTopBar && <NavBar />}
            <div className="min-h-0 flex-1">
                <Group orientation="horizontal" className="h-full w-full">
                    {leftSidebarSection}
                    <Panel className="min-w-0">{contentSection}</Panel>
                </Group>
            </div>
        </div>
    );
}
