// src/utils/cookieUtils.js
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'user_role';

// --- Token Management (Stored Securely in Cookies) ---

/**
 * Stores the authentication token in a secure cookie.
 * @param {string} token - The JWT received from the backend upon login.
 */
export const setToken = (token) => {
    // Set cookie with security flags: expires (7 days), secure (HTTPS only), sameSite (CSRF protection)
    Cookies.set(TOKEN_KEY, token, { 
        expires: 7, 
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'Strict' 
    });
};

/**
 * Retrieves the stored authentication token.
 * @returns {string | undefined} The JWT token.
 */
export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

/**
 * Removes the authentication token.
 */
export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};

// --- Role Management (Stored in localStorage for quick access) ---

/**
 * Stores the user's role (e.g., 'admin', 'patient').
 * @param {string} role - The user's role string.
 */
export const setRole = (role) => {
    localStorage.setItem(ROLE_KEY, role);
};

/**
 * Retrieves the user's role.
 * @returns {string | null} The user's role.
 */
export const getRole = () => {
    return localStorage.getItem(ROLE_KEY);
};

/**
 * Removes the user's role.
 */
export const removeRole = () => {
    localStorage.removeItem(ROLE_KEY);
};

/**
 * Clears all stored session data (used for logout).
 */
export const clearSession = () => {
    removeToken();
    removeRole();
};