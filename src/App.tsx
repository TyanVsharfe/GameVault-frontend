import {RootState} from "./store/store";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import Navigation from "./components/Navbar";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/search/SearchPage";
import UserInfoPage from "./pages/User/UserInfoPage";
import UserGamesPage from "./pages/User/UserGamesPage";
import UserSettingsPage from "./pages/User/UserSettingsPage";
import GamePage from "./pages/game/GamePage";
import FranchiseInfo from "./components/game/FranchiseInfo";
import {verifySession} from "./store/authSlice";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import "./assets/styles/style.css";
import UserAchievementsPage from "./pages/User/UserAchievementsPage";
import NotFoundPage from "./pages/NotFoundPage";
import '@fontsource/roboto';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const loading = useSelector((state: RootState) => state.auth.loading);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await dispatch(verifySession() as any).unwrap();

            const requiresAuthPaths = ['/account/games'];
            const isAuthRequired = requiresAuthPaths.some((path) =>
                location.pathname.startsWith(path)
            );
            const isLoginPage = location.pathname === '/login';

            console.log(
                'isAuthenticated (from verifySession):', isAuthenticated,
                'isLogin (from Redux):', isLogin,
                'loading:', loading,
                'path:', location.pathname
            );

            if (!loading && !isAuthenticated && isAuthRequired && !isLoginPage) {
                navigate('/login');
            }
        };

        checkAuth();
    }, [dispatch, navigate, location.pathname]);

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/main" element={<MainPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/registration" element={<RegisterPage/>} />
                <Route path="/account" element={<UserInfoPage />} />
                <Route path="/account/games" element={<UserGamesPage />} />
                <Route path="/account/settings" element={<UserSettingsPage />} />
                <Route path="/account/achievements" element={<UserAchievementsPage />} />
                <Route path="/games/:id" element={<GamePage />} />
                <Route path="/series/*" element={<FranchiseInfo />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}

export default App