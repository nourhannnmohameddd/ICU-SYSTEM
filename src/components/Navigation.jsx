// src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import styles from './Navigation.module.css';
import { useAuth } from '../contexts/AuthContext'; // 1. Import our new hook

const Navigation = () => {
  const navigate = useNavigate();
  // 2. Get everything we need from the context in one line
  const { isAuthenticated, userRole, logout } = useAuth();

  // Define links based on user role
  const getDashboardLink = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'manager': return '/manager';
      case 'doctor': return '/doctor';
      case 'nurse': return '/nurse';
      case 'receptionist': return '/receptionist';
      case 'cleaner': return '/cleaner';
      case 'patient': return '/patient-dashboard';
      default: return '/';
    }
  };

  const handleLogout = () => {
    logout(); // 3. Call the logout function from our context
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logoLink}>
          <Logo />
        </Link>
        <div className={styles.navLinks}>
          <Link to="/find-icu" className={styles.navItem}>
            Find ICU
          </Link>
          
          {/* 4. Use 'isAuthenticated' instead of checking the role directly */}
          {isAuthenticated && (
            <>
              {/* Link to the user's specific dashboard */}
              <Link to={getDashboardLink(userRole)} className={styles.navItem}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
              </Link>
              <button onClick={handleLogout} className={`${styles.navItem} ${styles.logoutBtn}`}>
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className={styles.navItem}>
                Login
              </Link>
              <Link to="/register" className={`${styles.navItem} ${styles.registerBtn}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;