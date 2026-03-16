import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { MainLayout } from "../core/components/MainLayout";
import { AppGlobalsProvider } from "../core/state/AppGlobalsContext";
import type { AppGlobals } from "../core/types/app";
import { onClick } from "./services/actionService";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";

export function App({ globals }: { globals: AppGlobals }) {
    const navigate = useNavigate();

    async function handleActionClick(actionId: string) {
        const result = await onClick(actionId);

        if (result.effect === "show-view" && result.view) {
            navigate(result.view.path);
        }
    }

    return (
        <AppGlobalsProvider value={globals} onActionClick={handleActionClick}>
            <main className="h-dvh w-full overflow-hidden">
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </AppGlobalsProvider>
    );
}
