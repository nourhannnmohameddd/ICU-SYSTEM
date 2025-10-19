// src/pages/ICUSelect.jsx
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from '../components/Map.jsx';
import Icus from '../components/Icus.jsx';
import { fetchAvailableICUs, reserveICU } from '../utils/api';
import socket from '../utils/realtime'; 
import { getRole } from '../utils/cookieUtils';
// Assuming you have a CSS file for this page:
import styles from './ICUSelect.module.css'; 

const ICUSelect = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [icus, setIcus] = useState([]);
    const [filters, setFilters] = useState({ specialization: '', searchTerm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userRole = getRole(); // Check if user is logged in (though this page is public)

    // --- 1. Get User Location (Initial Setup) ---
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error("Geolocation denied or failed. Using default location.", err);
                    setError("Could not detect your location. Showing ICUs near a major city.");
                    // Default to Cairo, Egypt
                    setUserLocation({ lat: 30.033333, lng: 31.233334 }); 
                }
            );
        }
    }, []);

    // --- 2. Data Fetching Logic (Triggers on filter/location change) ---
    const loadICUs = useCallback(async () => {
        if (!userLocation) return;
        setLoading(true);
        setError('');

        try {
            const { lat, lng } = userLocation;
            // Call API with current location and filter parameters
            const response = await fetchAvailableICUs({ 
                lat, 
                lng, 
                specialization: filters.specialization, 
                searchTerm: filters.searchTerm 
            });
            
            setHospitals(response.data.hospitals || []);
            setIcus(response.data.icus || []);
        } catch (err) {
            setError('Failed to load ICU data. Check your network or API server.');
        } finally {
            setLoading(false);
        }
    }, [userLocation, filters]);

    // Initial load and reload on filter/location change
    useEffect(() => {
        loadICUs();
    }, [loadICUs]);


    // --- 3. Real-Time Socket Updates ---
    useEffect(() => {
        if (!socket.connected) {
            socket.connect(); 
        }

        const handleIcuUpdate = (update) => {
            // Update the status of a specific ICU in the list instantly
            setIcus(prevIcus => prevIcus.map(icu => 
                icu.id === update.icuId ? { ...icu, status: update.newStatus } : icu
            ));
        };

        socket.on('icuStatusUpdate', handleIcuUpdate);

        return () => {
            socket.off('icuStatusUpdate', handleIcuUpdate);
        };
    }, []);

    // --- 4. Handlers ---
    const handleReserve = async (icuId) => {
        if (!userRole || userRole !== 'patient') {
            alert("You must be logged in as a Patient to reserve an ICU.");
            // Ideally, navigate to login page here: navigate('/login');
            return;
        }

        if (!window.confirm("Confirm reservation? This will reserve the ICU immediately.")) return;

        try {
            // Assuming the backend extracts the patientId from the JWT token
            await reserveICU(icuId); 
            alert('ICU reserved successfully! Check your dashboard.');
            // Reload data to reflect the change
            loadICUs(); 
        } catch (err) {
            alert(`Reservation failed: ${err.response?.data?.message || 'Server error.'}`);
        }
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
                {/* Search Term Input */}
                <input 
                    type="text" 
                    name="searchTerm"
                    placeholder="Search by hospital name or location" 
                    value={filters.searchTerm} 
                    onChange={handleFilterChange}
                />
                {/* Specialization Filter */}
                <select name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                    <option value="">All Specializations</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General">General</option>
                </select>
                <button onClick={loadICUs} disabled={loading} className={styles.searchButton}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
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