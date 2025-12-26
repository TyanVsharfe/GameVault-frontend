import {RootState} from "./store/store";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import Navigation from "./components/nav/Navbar";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/search/SearchPage";
import UserInfoPage from "./pages/User/UserInfoPage";
import UserGamesPage from "./pages/User/UserGamesPage";
import UserSettingsPage from "./pages/User/UserSettingsPage";
import GamePage from "./pages/game/GamePage";
import {verifySession} from "./store/authSlice";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UserAchievementsPage from "./pages/User/UserAchievementsPage";
import NotFoundPage from "./pages/NotFoundPage";
import '@fontsource/roboto';
import "./assets/styles/style.css";
import "./index.css";
import SeriesPage from "./pages/SeriesPage";
import UserCollectionsPage from "./pages/User/UserCollectionsPage";
import UserCollectionPage from "./pages/User/UserCollectionPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CircularProgress from '@mui/joy/CircularProgress';
import GameCompanyPage from "./pages/GameCompanyPage";

function App() {
    const dispatch = useDispatch();
    const { initialized } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(verifySession());
    }, [dispatch]);

    if (!initialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.5rem'
            }}>
                <CircularProgress variant="plain"/>
            </div>
        );
    }

    return (
        <>
            <Navigation/>
            <Routes>
                <Route path="/main" element={<MainPage/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/registration" element={<RegisterPage/>} />
                <Route path="/account" element={
                    <ProtectedRoute>
                        <UserInfoPage />
                    </ProtectedRoute>
                } />
                <Route path="/account/*"
                       element={
                           <ProtectedRoute>
                               <Routes>
                                   <Route path="games" element={<UserGamesPage />} />
                                   <Route path="lists" element={<UserCollectionsPage />} />
                                   <Route path="lists/:id" element={<UserCollectionPage />} />
                                   <Route path="settings" element={<UserSettingsPage />} />
                                   <Route path="achievements" element={<UserAchievementsPage />} />
                               </Routes>
                           </ProtectedRoute>
                       }/>
                <Route path="/games/:id" element={<GamePage />} />
                <Route path="/series/:series" element={<SeriesPage />} />
                <Route path="/company/:company" element={<GameCompanyPage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/404" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default App