// src/pages/ICUSelect.jsx
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from '../components/Map.jsx';
import Icus from '../components/Icus.jsx';
import { fetchAvailableICUs, reserveICU } from '../utils/api';
import socket from '../utils/realtime'; 
import { getRole } from '../utils/cookieUtils';
import styles from './ICUSelect.module.css'; 
import Button from '../components/Button'; // 1. Import Button

const ICUSelect = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [icus, setIcus] = useState([]);
    const [filters, setFilters] = useState({ specialization: '', searchTerm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userRole = getRole();

    // --- Data Fetching and Real-Time Updates (logic remains the same) ---
    useEffect(() => {
        // ... geolocation logic ...
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                (err) => {
                    console.error("Geolocation failed.", err);
                    setUserLocation({ lat: 30.033333, lng: 31.233334 }); 
                }
            );
        }
    }, []);
    
    const loadICUs = useCallback(async () => {
        // ... data loading logic ...
    }, [userLocation, filters]);

    useEffect(() => {
        loadICUs();
    }, [loadICUs]);

    useEffect(() => {
        // ... socket logic ...
    }, []);


    // --- Handlers ---
    const handleReserve = async (icuId) => {
        // ... reservation logic ...
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (!userLocation && !error) return <div className={styles.loadingState}>Attempting to find nearest ICUs...</div>;
    
    return (
        <div className={styles.finderPage}>
            <header className={styles.pageHeader}>
                <h1>Select Nearest Available ICU</h1>
                <p>Real-time availability using Leaflet. Log in to reserve.</p>
            </header>

            <div className={styles.controls}>
                <input 
                    type="text" 
                    name="searchTerm"
                    placeholder="Search by hospital name or location" 
                    value={filters.searchTerm} 
                    onChange={handleFilterChange}
                />
                <select name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                    <option value="">All Specializations</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General">General</option>
                </select>
                {/* 2. Replace the old button */}
                <Button onClick={loadICUs} disabled={loading} variant="primary">
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </div>

            {error && <div className={styles.alertError}>{error}</div>}

            <div className={styles.contentGrid}>
                <div className={styles.mapArea}>
                    <MapComponent hospitalsData={hospitals} userLocation={userLocation} />
                </div>
                
                <div className={styles.listArea}>
                    <h3>{icus.length} Available ICUs</h3>
                    <Icus icuList={icus} onReserve={handleReserve} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default ICUSelect;