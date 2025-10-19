// src/pages/UpdateMedicalDetails.jsx
import React, { useState, useEffect } from 'react';
import { updateMedicalHistory } from '../utils/api';
import styles from './UpdateMedicalDetails.module.css'; // Assuming you create this CSS

const UpdateMedicalDetails = ({ patientId, initialHistory, onUpdateComplete }) => {
    const [history, setHistory] = useState(initialHistory || '');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ensure state updates if initialHistory prop changes
    useEffect(() => {
        setHistory(initialHistory);
    }, [initialHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const payload = { history };
            // await updateMedicalHistory(patientId, payload); // API call
            
            setMessage({ type: 'success', text: 'Medical details updated successfully.' });
            onUpdateComplete(history); // Notify parent component
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.cardContainer}>
            <h3 className={styles.title}>Update Medical History</h3>
            
            {message && (
                <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label} htmlFor="medicalHistory">Current Medical Status & Allergies:</label>
                <textarea 
                    id="medicalHistory"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Provide detailed, critical information about allergies, chronic conditions, and current symptoms."
                    rows="8"
                    required
                    disabled={loading}
                    className={styles.textArea}
                />
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'Saving...' : 'Save Updates'}
                </button>
            </form>
        </div>
    );
};
export default UpdateMedicalDetails;