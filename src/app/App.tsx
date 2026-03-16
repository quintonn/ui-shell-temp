import { AboutPage } from "@/app/pages/AboutPage";
import { HomePage } from "@/app/pages/HomePage";
import { MainLayout } from "@/core/components/MainLayout";
import { AppGlobalsProvider } from "@/core/state/AppGlobalsContext";
import { AppGlobals } from "@/core/types/app";
import { DefaultIconService } from "@/core/services/iconService";
import { Route, Routes } from "react-router-dom";


export function App({ globals, iconService }: { globals: AppGlobals; iconService?: DefaultIconService }) {
    return (
        <AppGlobalsProvider value={globals} iconService={iconService}>
            <main className="h-dvh w-full overflow-hidden">
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="*" element={<div>Unknown path</div>} />
                    </Route>
                </Routes>
            </main>
        </AppGlobalsProvider>
    );
}
