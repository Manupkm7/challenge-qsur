import { Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import NotFoundPage from "./NotFoundPage";
import { AllItems } from "./AllItems";
import { SettingsPage } from "./Configuration";
import { History } from "./History";

export const Landing = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='home' />} />
            <Route
                path='home'
                element={
                    <App />
                }
            >
                <Route path='' element={<AllItems />} />
                <Route path='settings' element={<SettingsPage />} />
                <Route path='history' element={<History />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}
