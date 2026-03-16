export function GlobalStartupSpinner() {
    return (
        <div className="fixed inset-0 grid place-items-center bg-slate-950/6 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-900/10">
                <div
                    aria-hidden="true"
                    className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"
                />
                <p className="text-sm font-medium text-slate-700">Loading application...</p>
            </div>
        </div>
    );
}
