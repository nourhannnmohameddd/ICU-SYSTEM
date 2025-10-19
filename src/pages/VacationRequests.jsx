// src/pages/VacationRequests.jsx
import React, { useState, useEffect } from 'react';
import { approveVacation } from '../utils/api';
import styles from './VacationRequests.module.css';

const VacationRequests = ({ hospitalId = 'HOSP_XYZ' }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // MOCK DATA: Load requests for the manager's hospital
    useEffect(() => {
        const loadRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                // In a real app: const response = await fetchVacationRequests(hospitalId); 
                const mockRequests = [
                    { id: 'v001', employee: 'Nurse Karim Ali', role: 'Nurse', startDate: '2025-11-01', endDate: '2025-11-07', reason: 'Family event', status: 'PENDING' },
                    { id: 'v002', employee: 'Cleaner Ahmed', role: 'Cleaner', startDate: '2025-10-25', endDate: '2025-10-27', reason: 'Personal time', status: 'PENDING' },
                    { id: 'v003', employee: 'Dr. Hana Elsayed', role: 'Doctor', startDate: '2025-12-01', endDate: '2025-12-31', reason: 'Extended research trip', status: 'APPROVED' },
                ];
                setRequests(mockRequests);
            } catch (err) {
                setError("Failed to fetch vacation requests.");
            } finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, [hospitalId]);

    const handleApproval = async (requestId, decision) => {
        const decisionText = decision.toUpperCase();
        if (!window.confirm(`Are you sure you want to ${decisionText} request ID ${requestId}?`)) return;

        try {
            // await approveVacation(requestId, decisionText); // API call
            
            // Optimistically update UI
            setRequests(prev => prev.map(req => 
                req.id === requestId ? { ...req, status: decisionText } : req
            ));
            alert(`Request ${requestId} ${decisionText} successfully.`);

        } catch (err) {
            setError(`Failed to process request: ${err.message}`);
            // If API fails, revert the state change here
        }
    };

    if (loading) return <div className={styles.loading}>Loading vacation requests...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pending Vacation Requests</h2>
            {error && <div className={styles.alertError}>{error}</div>}
            
            <div className={styles.requestCount}>
                Total Pending: {requests.filter(r => r.status === 'PENDING').length}
            </div>

            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Dates Requested</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.employee}</td>
                            <td>{req.role}</td>
                            <td>{req.startDate} to {req.endDate}</td>
                            <td className={styles.reason}>{req.reason}</td>
                            <td><span className={styles[`status${req.status}`]}>{req.status}</span></td>
                            <td className={styles.actionButtons}>
                                {req.status === 'PENDING' ? (
                                    <>
                                        <button onClick={() => handleApproval(req.id, 'Approved')} className={styles.btnApprove}>Approve</button>
                                        <button onClick={() => handleApproval(req.id, 'Rejected')} className={styles.btnReject}>Reject</button>
                                    </>
                                ) : (
                                    <span className={styles.statusCompleted}>{req.status}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default VacationRequests;