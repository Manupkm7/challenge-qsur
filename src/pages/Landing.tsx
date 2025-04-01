import { Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import NotFoundPage from "./NotFoundPage";
import { AllItems } from "./AllItems";

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
                {/*
                        <Route path='' element={<Statistics />} />
        <Route path='pending-tasks' element={<PendingTask />} />
        <Route path='interaction/:interactionId' element={<InteractionPage />} />
        <Route path='inbox' element={<Inbox />} />
        <Route path='preview' element={<Preview />} />
        <Route path='history' element={<History />} />
        <Route path=':anything' element={<Navigate to='' replace />} />
                */}
            </Route>

            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}
