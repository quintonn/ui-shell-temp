export type ActionResponse = {
    actionId: string;
    effect: "show-view" | "notify";
    view?: {
        id: string;
        path: string;
        title: string;
    };
    message?: string;
};

type ActionView = {
    id: string;
    path: string;
    title: string;
};

const ACTION_VIEW_MAP: Record<string, ActionView> = {
    "view.home": { id: "home", path: "/", title: "Home" },
    "view.about": { id: "about", path: "/about", title: "About" },
};

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

async function mockActionApi(actionId: string): Promise<ActionResponse> {
    await sleep(120);

    const mappedView = ACTION_VIEW_MAP[actionId];
    if (mappedView) {
        return {
            actionId,
            effect: "show-view",
            view: mappedView,
        };
    }

    return {
        actionId,
        effect: "notify",
        message: `Action '${actionId}' executed.`,
    };
}

export async function onClick(actionId: string) {
    return mockActionApi(actionId);
}
