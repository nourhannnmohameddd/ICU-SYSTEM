// src/components/Logo.jsx
import React from 'react';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <span className={styles.logoText}>ICU System</span>
    </div>
  );
};

export default Logo;