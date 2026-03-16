export function AboutPage() {
    return (
        <section className="flex h-full flex-col gap-3">
            <h1 className="text-3xl font-bold text-slate-950">About</h1>
            <p className="text-slate-600">
                This page is rendered through a nested route inside the main layout outlet.
            </p>
            {/* <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50" /> */}
        </section>
    );
}
