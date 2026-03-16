import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Group, Panel, type PanelImperativeHandle } from "react-resizable-panels";
import { Breadcrumbs } from "./layout/Breadcrumbs";
import { NavBar } from "./layout/NavBar";
import { ResizeHandle, RightSidebar, Sidebar } from "./layout/SidePanels";
import { useAppGlobals } from "../state/AppGlobalsContext";

function ContentArea() {
    return (
        <main className="h-full min-h-0 flex-1 overflow-hidden bg-slate-50">
            <div className="mx-auto flex h-full min-h-0 flex-col bg-white p-6 shadow-sm">
                <Breadcrumbs />
                <div className="min-h-0 flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export function MainLayout() {
    const { appName, layout, sidebarItems } = useAppGlobals();

    const includeTopBar = layout.includeTopBar;

    const showLeftSidebar = layout.leftSidebarPlacement !== "hidden";
    const showRightSidebar = layout.rightSidebarPlacement !== "hidden";
    const leftSidebarOverNavBar = layout.leftSidebarPlacement === "over-nav";
    const rightSidebarOverNavBar = layout.rightSidebarPlacement === "over-nav";

    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const leftSidebarPanelRef = useRef<PanelImperativeHandle | null>(null);

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
            defaultSize="20%"
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

    const contentSection = showRightSidebar ? (
        <Group orientation="horizontal" className="h-full w-full">
            <Panel className="min-w-0">
                <ContentArea />
            </Panel>
            <ResizeHandle disabled={rightSidebarDisabled} />
            <RightSidebar disabled={rightSidebarDisabled} />
        </Group>
    ) : (
        <ContentArea />
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
                        <ContentArea />
                    </div>
                </Panel>
                <ResizeHandle disabled={rightSidebarDisabled} />
                <RightSidebar disabled={rightSidebarDisabled} />
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
                                    <ContentArea />
                                </Panel>
                            </Group>
                        </div>
                    </div>
                </Panel>
                <ResizeHandle disabled={rightSidebarDisabled} />
                <RightSidebar disabled={rightSidebarDisabled} />
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
