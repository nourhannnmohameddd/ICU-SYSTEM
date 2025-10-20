// src/pages/adminPages/ViewAllHospital.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // 1. Import toast
import { viewAllHospitals, blockHospital } from '../../utils/api';
import styles from './ViewAllHospital.module.css';
import Button from '../../components/Button';

const mockHospitals = [
    { id: 'h1', name: 'Al-Salam Hospital', rating: 4.8, isBlocked: false, manager: 'Mngr 1', icuCount: 15 },
    { id: 'h2', name: 'North Star Medical', rating: 3.5, isBlocked: true, manager: 'Mngr 2', icuCount: 8 },
    { id: 'h3', name: 'General City Clinic', rating: 4.1, isBlocked: false, manager: 'Mngr 3', icuCount: 22 },
];

const ViewAllHospital = ({ newHospitalAdded }) => {
    const [hospitals, setHospitals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    // 2. The 'error' state is no longer needed
    // const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospitals = async () => {
            setLoading(true);
            try {
                // In a real app: const data = await viewAllHospitals();
                // For now, we use the mock data.
                setHospitals(mockHospitals);
            } catch (err) {
                // 3. Use toast for fetch errors
                toast.error("Failed to load hospital data.");
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, [newHospitalAdded]);
    
    // 4. Updated handler with toast and instant UI update
    const handleBlockToggle = async (hospitalId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            // await blockHospital(hospitalId, newStatus); // API call
            setHospitals(prev => prev.map(h => 
                h.id === hospitalId ? { ...h, isBlocked: newStatus } : h
            ));
            toast.success(`Hospital has been ${newStatus ? 'blocked' : 'unblocked'}.`);
        } catch (err) {
            toast.error('Failed to update hospital status.');
        }
    };
    
    // 5. Updated handler with confirmation toast and instant UI update
    const handleDelete = async (hospitalId) => {
        const performDelete = () => {
            setHospitals(prev => prev.filter(h => h.id !== hospitalId));
            toast.success(`Hospital ${hospitalId} has been deleted.`);
        };

        const ConfirmationToast = ({ closeToast }) => (
            <div>
                <p>Are you sure you want to delete this hospital?</p>
                <Button onClick={() => { performDelete(); closeToast(); }} variant="danger" style={{ marginRight: '10px' }}>Yes, Delete</Button>
                <Button onClick={closeToast} variant="secondary">Cancel</Button>
            </div>
        );
        
        toast.warn(<ConfirmationToast />, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
    };

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.listContainer}>
            <h3 className={styles.title}>All Registered Hospitals ({hospitals.length})</h3>
            
            {/* 6. Removed old error message div */}

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