import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ProtectedRoute = () => {
    const location = useLocation();
    const { isLogin } = useSelector((state: RootState) => state.auth);

    if (!isLogin) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace/>;
    }

    return <Outlet />;
};

export default ProtectedRoute;