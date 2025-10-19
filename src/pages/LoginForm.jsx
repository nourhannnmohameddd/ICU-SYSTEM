// src/pages/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { setToken, setRole } from '../utils/cookieUtils';
import styles from './LoginForm.css'; 
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser(credentials);
            const { token, role } = response.data;

            // 1. Store session data
            setToken(token);
            setRole(role);

            // 2. Navigate based on user role
            let path = '/';
            switch (role) {
                case 'admin': path = '/admin'; break;
                case 'manager': path = '/manager'; break;
                case 'patient': path = '/patient-dashboard'; break;
                case 'doctor': path = '/doctor'; break;
                case 'nurse': path = '/nurse'; break;
                case 'receptionist': path = '/receptionist'; break;
                case 'cleaner': path = '/cleaner'; break;
                default: path = '/';
            }
            navigate(path, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.formCard}>
                <h2 className={styles.title}>Welcome Back</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                
                <label className={styles.label}>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={styles.inputField}
                    required
                />
                <label className={styles.label}>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={styles.inputField}
                    required
                />
                
                <button type="submit" disabled={loading} className={styles.loginButton}>
                    {loading ? 'Authenticating...' : 'Login'}
                </button>
                
                <div className={styles.linksContainer}>
                    <Link to="/register" className={styles.registerLink}>Register as Patient</Link>
                    <Link to="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
                </div>
            </form>
        </div>
    );
};
export default LoginForm;