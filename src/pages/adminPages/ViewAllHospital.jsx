// src/pages/adminPages/ViewAllHospital.jsx
import React, { useState, useEffect } from 'react';
import { viewAllHospitals, blockHospital, viewHospitalRating } from '../../utils/api'; // API functions
import styles from './ViewAllHospital.module.css';

// Mock Data for initial state (will be replaced by API call)
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

    // --- Data Fetching ---
    useEffect(() => {
        const loadHospitals = async () => {
            setLoading(true);
            setError(null);
            try {
                // In a real app: const response = await viewAllHospitals();
                // setHospitals(response.data.hospitals);
                
                // Use mock data for immediate setup
                setHospitals(mockHospitals);
            } catch (err) {
                setError('Failed to fetch hospital list.');
            } finally {
                setLoading(false);
            }
        };

        loadHospitals();
        // Trigger reload when a new hospital is added from the sibling component
    }, [newHospitalAdded]); 
    
    // --- Handlers ---
    const handleBlockToggle = async (hospitalId, currentStatus) => {
        const newStatus = !currentStatus;
        if (!window.confirm(`Are you sure you want to ${newStatus ? 'BLOCK' : 'UNBLOCK'} this hospital?`)) return;

        try {
            // await blockHospital(hospitalId); 
            
            // Optimistically update UI
            setHospitals(prev => prev.map(h => 
                h.id === hospitalId ? { ...h, isBlocked: newStatus } : h
            ));
            alert(`Hospital status updated to ${newStatus ? 'BLOCKED' : 'ACTIVE'}.`);

        } catch (err) {
            setError(`Failed to update status for ${hospitalId}.`);
            // Revert optimistic update on failure (optional)
        }
    };
    
    const handleDelete = async (hospitalId) => {
        if (!window.confirm("WARNING: Deleting a hospital is permanent. Continue?")) return;
        
        try {
            // await deleteHospital(hospitalId); // Assuming you add a deleteHospital API function
            
            // Update UI by filtering out the deleted hospital
            setHospitals(prev => prev.filter(h => h.id !== hospitalId));
            alert('Hospital deleted successfully.');
        } catch (err) {
            setError(`Failed to delete hospital ${hospitalId}.`);
        }
    };

    // --- Filtering Logic ---
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
                                    <button 
                                        onClick={() => handleBlockToggle(hospital.id, hospital.isBlocked)}
                                        className={hospital.isBlocked ? styles.btnUnblock : styles.btnBlock}
                                    >
                                        {hospital.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(hospital.id)}
                                        className={styles.btnDelete}
                                    >
                                        Delete
                                    </button>
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