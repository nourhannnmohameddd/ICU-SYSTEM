// src/pages/PrivateRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAuthorized, clearSession } from '../utils/auth'; 
import { getRole } from '../utils/cookieUtils'; 

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const authenticated = isAuthenticated();
    const userRole = getRole();
    const authorized = isAuthorized(allowedRoles);
    
    // 1. Not Authenticated: Redirect to Login
    if (!authenticated) {
        // Clear anything stale and redirect
        clearSession(); 
        return <Navigate to="/login" replace />;
    }

    // 2. Authenticated but Unauthorized (Role Check)
    // This catches users who try to access /admin when they are a 'patient'
    if (userRole && allowedRoles.length > 0 && !authorized) {
        console.warn(`Access denied. User role '${userRole}' is not allowed to view this page.`);
        // Redirect to a known, safe dashboard for their role (e.g., patient home)
        const safePath = userRole === 'patient' ? '/patient-dashboard' : '/';
        return <Navigate to={safePath} replace />;
    }

    // 3. Authenticated and Authorized: Render the requested page
    return children;
};

export default PrivateRoute;
