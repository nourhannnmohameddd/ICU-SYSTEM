// src/pages/adminPages/AddHospital.jsx
import React, { useState } from 'react';
import { addHospital } from '../../utils/api';
import styles from './AddHospital.module.css';
import Button from '../../components/Button'; // 1. Import Button

const AddHospital = ({ onHospitalAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        latitude: '',
        longitude: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
            setMessage({ type: 'error', text: 'Latitude and Longitude must be valid numbers.' });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };
            
            // MOCK API CALL
            // const response = await addHospital(payload);
            const response = { data: { name: formData.name } }; // Mock response
            
            setMessage({ type: 'success', text: `Hospital "${response.data.name}" added successfully!` });
            setFormData({ name: '', address: '', phone: '', email: '', latitude: '', longitude: '' });
            
            onHospitalAdded(response.data);

        } catch (error) {
            console.error('Add Hospital Error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add hospital. Server error.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.cardContainer}>
            <h3 className={styles.title}>Register New Hospital</h3>
            {message && (
                <div className={`${styles.alert} ${message.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Input fields remain the same... */}
                <div className={styles.formGroup}>
                    <label htmlFor="name">Hospital Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required disabled={loading} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                </div>
                
                <h4 className={styles.subtitle}>Geographic Coordinates (For Leaflet Map)</h4>
                <div className={styles.coordinatesGroup}>
                    <div className={styles.formGroup}>
                        <label htmlFor="latitude">Latitude</label>
                        <input type="number" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g., 30.0444" required disabled={loading} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="longitude">Longitude</label>
                        <input type="number" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g., 31.2357" required disabled={loading} />
                    </div>
                </div>

                {/* 2. Replace the old button */}
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Hospital'}
                </Button>
            </form>
        </div>
    );
};
export default AddHospital;