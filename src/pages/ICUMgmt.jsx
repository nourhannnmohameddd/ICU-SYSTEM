// src/pages/ICUMgmt.jsx
import React, { useState, useEffect } from 'react';
import { viewHospitalICUs, deleteICU } from '../utils/api';
import styles from './ICUMgmt.module.css';
import socket from '../utils/realtime';

const ICUMgmt = ({ hospitalId }) => {
    const [icus, setIcus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching ---
    useEffect(() => {
        const loadIcus = async () => {
            setLoading(true);
            try {
                // In a real app: const response = await viewHospitalICUs(hospitalId);
                const mockIcus = [
                    { id: 'icu01', room: '101', specialization: 'Cardiology', status: 'AVAILABLE', capacity: 1, fee: 600 },
                    { id: 'icu02', room: '102', specialization: 'Neurology', status: 'OCCUPIED', capacity: 1, fee: 800 },
                    { id: 'icu03', room: '103', specialization: 'General', status: 'MAINTENANCE', capacity: 2, fee: 500 },
                ];
                setIcus(mockIcus);
            } catch (error) {
                console.error('Failed to load ICUs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIcus();
        
        // --- Socket Listener Setup ---
        socket.on('icuStatusUpdate', (update) => {
            setIcus(prev => prev.map(icu => 
                icu.id === update.icuId ? { ...icu, status: update.newStatus } : icu
            ));
        });
        
        return () => {
            socket.off('icuStatusUpdate');
        };
    }, [hospitalId]);

    // --- Handlers ---
    const handleStatusUpdate = (icuId, currentStatus) => {
        // Simplistic UI to show update options
        const newStatus = prompt(`Update status for ICU ${icuId}. Enter one: AVAILABLE, OCCUPIED, MAINTENANCE`, currentStatus);
        
        if (newStatus && ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'].includes(newStatus.toUpperCase())) {
            // In a real app, this sends the update to the backend API, which then broadcasts via socket
            // setIcuStatus(icuId, newStatus); 
            
            // Optimistic update
            setIcus(prev => prev.map(icu => 
                icu.id === icuId ? { ...icu, status: newStatus.toUpperCase() } : icu
            ));
        }
    };
    
    const handleDelete = async (icuId) => {
        if (!window.confirm(`Are you sure you want to delete ICU ${icuId}?`)) return;
        
        try {
            // await deleteICU(icuId); // API Call
            setIcus(prev => prev.filter(icu => icu.id !== icuId));
            alert('ICU deleted.');
        } catch (error) {
            alert('Failed to delete ICU.');
        }
    };

    const filteredIcus = icus.filter(icu =>
        icu.room.includes(searchTerm) || icu.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>ICU Management Overview</h2>
            
            <div className={styles.controls}>
                <input 
                    type="text" 
                    placeholder="Search by room or specialization..."
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className={styles.searchInput}
                />
            </div>

            {loading ? <div className={styles.loading}>Loading ICUs...</div> : (
                <table className={styles.icuTable}>
                    <thead>
                        <tr>
                            <th>Room #</th>
                            <th>Specialization</th>
                            <th>Capacity</th>
                            <th>Daily Fee</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIcus.map(icu => (
                            <tr key={icu.id}>
                                <td>{icu.room}</td>
                                <td>{icu.specialization}</td>
                                <td>{icu.capacity}</td>
                                <td>EGP {icu.fee}</td>
                                <td>
                                    <span className={styles[`status${icu.status.replace('_', '')}`]}>
                                        {icu.status}
                                    </span>
                                </td>
                                <td className={styles.actions}>
                                    <button onClick={() => handleStatusUpdate(icu.id, icu.status)} className={styles.btnUpdate}>
                                        Update Status
                                    </button>
                                    <button onClick={() => handleDelete(icu.id)} className={styles.btnDelete}>
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

export default ICUMgmt;