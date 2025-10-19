// src/pages/UpdateMedicalDetails.jsx
import React, { useState, useEffect } from 'react'; // <-- COMMA ADDED HERE
import { updateMedicalHistory } from '../utils/api';
import styles from './UpdateMedicalDetails.module.css';
import Button from '../components/Button';

const UpdateMedicalDetails = ({ patientId, initialHistory, onUpdateComplete }) => {
    const [history, setHistory] = useState(initialHistory || '');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHistory(initialHistory);
    }, [initialHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            // Mock API Call
            setMessage({ type: 'success', text: 'Medical details updated successfully.' });
            if (onUpdateComplete) {
                onUpdateComplete(history);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Update failed.' });
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
                    rows="8"
                    required
                    disabled={loading}
                    className={styles.textArea}
                />
                <Button type="submit" disabled={loading} variant="primary">
                    {loading ? 'Saving...' : 'Save Updates'}
                </Button>
            </form>
        </div>
    );
};
export default UpdateMedicalDetails;