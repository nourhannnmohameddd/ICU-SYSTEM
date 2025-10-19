// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Button from '../components/Button'; // 1. Import Button

const LandingPage = () => {
    const navigate = useNavigate();

    const handleFindIcuClick = () => {
        // Directs the user to the core ICU search functionality
        navigate('/find-icu');
    };

    return (
        <div className={styles.heroContainer}>
            <header className={styles.heroHeader}>
                <h1>ICU Connect: Real-time Critical Care Reservations</h1>
                <p>Find the nearest available Intensive Care Unit (ICU) across our network of hospitals instantly.</p>
            </header>

            <div className={styles.actionSection}>
                {/* 2. Replace the old button */}
                <Button
                    onClick={handleFindIcuClick}
                    variant="primary"
                    className={styles.primaryButton} // Apply custom sizing
                >
                    Find Nearest ICU Now
                    <i className="fas fa-search-location" style={{ marginLeft: '10px' }}></i>
                </Button>
            </div>

            <section className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                    <i className="fas fa-map-marked-alt" style={{ color: '#007bff' }}></i>
                    <h3>Nearest Location</h3>
                    <p>Uses geolocation (Leaflet) to find the closest hospital with immediate openings.</p>
                </div>
                <div className={styles.featureCard}>
                    <i className="fas fa-bed" style={{ color: '#28a745' }}></i>
                    <h3>Real-Time Status</h3>
                    <p>View ICU availability and specialization status updated instantly via WebSocket.</p>
                </div>
                <div className={styles.featureCard}>
                    <i className="fas fa-user-shield" style={{ color: '#ffc107' }}></i>
                    <h3>Secure Management</h3>
                    <p>Dedicated portals for Admins, Managers, and Medical staff to ensure compliance.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;