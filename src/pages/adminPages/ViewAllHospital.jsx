// src/pages/adminPages/ViewAllHospital.jsx
import React, { useState, useEffect } from 'react';
import { viewAllHospitals, blockHospital } from '../../utils/api';
import styles from './ViewAllHospital.module.css';
import Button from '../../components/Button'; // 1. Import Button

const mockHospitals = [
    { id: 'h1', name: 'Al-Salam Hospital', rating: 4.8, isBlocked: false, manager: 'Mngr 1', icuCount: 15 },
    { id: 'h2', name: 'North Star Medical', rating: 3.5, isBlocked: true, manager: 'Mngr 2', icuCount: 8 },
    { id: 'h3', name: 'General City Clinic', rating: 4.1, isBlocked: false, manager: 'Mngr 3', icuCount: 22 },
];

const ViewAllHospital = ({ newHospitalAdded }) => {
    const [hospitals, setHospitals] = useState(mockHospitals);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ... (data fetching logic remains the same)
    }, [newHospitalAdded]);
    
    const handleBlockToggle = async (hospitalId, currentStatus) => {
        // ... (handler logic remains the same)
        alert(`Hospital status updated.`);
    };
    
    const handleDelete = async (hospitalId) => {
        // ... (handler logic remains the same)
        alert('Hospital deleted successfully.');
    };

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.listContainer}>
            <h3 className={styles.title}>All Registered Hospitals ({hospitals.length})</h3>
            
            {error && <div className={styles.alertError}>{error}</div>}

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search by name or manager..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <div className={styles.loading}>Loading hospital data...</div>
            ) : (
                <table className={styles.hospitalTable}>
                    <thead>
                        <tr>
                            <th>Hospital Name</th>
                            <th>Rating</th>
                            <th>ICU Count</th>
                            <th>Manager</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHospitals.map(hospital => (
                            <tr key={hospital.id}>
                                <td>{hospital.name}</td>
                                <td>{hospital.rating.toFixed(1)} <span className={styles.star}>★</span></td>
                                <td>{hospital.icuCount}</td>
                                <td>{hospital.manager}</td>
                                <td>
                                    <span className={hospital.isBlocked ? styles.statusBlocked : styles.statusActive}>
                                        {hospital.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                                    </span>
                                </td>
                                <td className={styles.actionButtons}>
                                    {/* 2. Replace the old buttons */}
                                    <Button
                                        onClick={() => handleBlockToggle(hospital.id, hospital.isBlocked)}
                                        variant={hospital.isBlocked ? 'success' : 'secondary'}
                                        className={styles.actionBtn}
                                    >
                                        {hospital.isBlocked ? 'Unblock' : 'Block'}
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(hospital.id)}
                                        variant="danger"
                                        className={styles.actionBtn}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default ViewAllHospital;