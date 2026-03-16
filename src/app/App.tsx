import { AboutPage } from "@/app/pages/AboutPage";
import { HomePage } from "@/app/pages/HomePage";
import { onClick } from "@/app/services/actionService";
import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider } from "@/core/state/AppGlobalsContext";
import { AppGlobals } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";


export function App({ globals, iconService }: { globals: AppGlobals; iconService?: DefaultIconService }) {
    const navigate = useNavigate();

    async function handleActionClick(actionId: string) {
        const result = await onClick(actionId);

        if (result.effect === "show-view" && result.view) {
            navigate(result.view.path);
        }
    }

    return (
        <AppGlobalsProvider value={globals} onActionClick={handleActionClick} iconService={iconService}>
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
