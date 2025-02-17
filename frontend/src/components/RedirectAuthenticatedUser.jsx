import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isAuthenticated) {
        return <Navigate to={user?.role === 'Admin' ? '/dashboard' : '/dashboard'} replace />;
    }
    return <Navigate to="/" replace />;
};

export default RedirectAuthenticatedUser;
