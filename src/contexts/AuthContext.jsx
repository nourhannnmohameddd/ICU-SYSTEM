import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, getRole, removeToken, removeRole } from '../utils/cookieUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ token: getToken(), role: getRole() });

    const logout = () => {
        removeToken();
        removeRole();
        setUser({ token: null, role: null });
    };
    
    // We can add a login function here later to make login flow cleaner
    const login = (token, role) => {
        // This part is for later, but it shows how we'd update the context
        setUser({ token, role });
    }

    // The value provided to all components that use this context
    const authValue = {
        isAuthenticated: !!user.token,
        userRole: user.role,
        logout,
        login, // Expose login function
    };

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

// This is the custom hook that our components will use to get the auth state
export const useAuth = () => {
    return useContext(AuthContext);
};