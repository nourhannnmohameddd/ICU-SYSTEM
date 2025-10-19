// src/pages/PatientHomePage.jsx
import React, { useState, useEffect } from 'react';
import { updateMedicalHistory, reserveVisitorsRoom, rateDoctorAndHospital } from '../utils/api';
import styles from './PatientHomePage.module.css'; 
import Button from '../components/Button'; // 1. Import Button

const PatientHomePage = () => {
    const [patientData, setPatientData] = useState(null);
    const [newMedicalHistory, setNewMedicalHistory] = useState('');
    const [loading, setLoading] = useState(true);

    // MOCK DATA: Replace with real API call
    const fetchPatientData = async () => {
        const mockData = {
            id: 'pat123',
            name: 'John Doe',
            reservedICU: 'Hospital A - Room 101 (Cardiology)',
            medicalHistory: 'Allergies: Penicillin. Chronic: Asthma.',
            fees: 2500.50,
            medSchedule: [{ time: '8:00 AM', med: 'Med A' }, { time: '6:00 PM', med: 'Med B' }],
            assignedDoctor: { id: 'doc456', name: 'Dr. Jane Smith', rating: 4.8 }
        };
        setPatientData(mockData);
        setNewMedicalHistory(mockData.medicalHistory);
        setLoading(false);
    };

    useEffect(() => {
        fetchPatientData();
    }, []);

    const handleUpdateMedicalHistory = async (e) => {
        e.preventDefault();
        // ... (API logic remains the same)
        alert('Medical history updated successfully!');
    };

    const handleRate = async (type) => {
        const rating = prompt(`Enter rating (1-5) for ${type}:`);
        if (rating) alert(`${type} rated successfully!`);
    };

    const handleReserveVisitorsRoom = async () => {
        const visitorName = prompt('Enter visitor name and expected time:');
        if (visitorName) alert('Visitor room request submitted!');
    };

    if (loading) return <div className={styles.loadingState}>Loading patient dashboard...</div>;
    if (!patientData) return <div className={styles.errorState}>Could not load patient data.</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h2 className={styles.welcomeTitle}>Welcome, {patientData.name}</h2>
                <div className={styles.icuStatus}>
                    <i className="fas fa-heartbeat"></i> Reserved ICU: **{patientData.reservedICU || 'None'}**
                </div>
            </header>

            <section className={styles.infoGrid}>
                <div className={styles.card}>
                    <h3>Medicine Schedule</h3>
                    <p>Assigned Doctor: Dr. {patientData.assignedDoctor.name} ({patientData.assignedDoctor.rating} ★)</p>
                    <ul className={styles.scheduleList}>
                        {patientData.medSchedule.map((item, index) => (
                            <li key={index}><strong>{item.time}:</strong> {item.med}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.card}>
                    <h3>Total Fees</h3>
                    <p className={styles.feeAmount}>EGP {patientData.fees.toFixed(2)}</p>
                    {/* 2. Replace button */}
                    <Button variant="secondary">Show Total Fees</Button>
                </div>

                <div className={`${styles.card} ${styles.ratingCard}`}>
                    <h3 className={styles.subtitle}>Update Medical History</h3>
                    <form onSubmit={handleUpdateMedicalHistory}>
                        <textarea 
                            value={newMedicalHistory} 
                            onChange={(e) => setNewMedicalHistory(e.target.value)}
                            rows="4"
                            required
                        />
                        {/* 2. Replace button */}
                        <Button type="submit" variant="primary">Save History</Button>
                    </form>
                </div>
            </section>

            <section className={styles.reservationActions}>
                <div className={styles.actionGroup}>
                    <h3>Reserve Visitor's Room</h3>
                    {/* 2. Replace button */}
                    <Button onClick={handleReserveVisitorsRoom} className={styles.btnAction}>Request Visitor Slot</Button>
                </div>
                <div className={styles.actionGroup}>
                    <h3>Kids Area Access</h3>
                    {/* 2. Replace button */}
                    <Button className={styles.btnAction}>Reserve Time-Slot</Button>
                </div>
                <div className={styles.actionGroup}>
                    <h3>Service Feedback</h3>
                    {/* 2. Replace buttons */}
                    <Button onClick={() => handleRate('Doctor')} className={styles.btnRate}>Rate Doctor</Button>
                    <Button onClick={() => handleRate('Hospital')} className={styles.btnRate}>Rate Hospital</Button>
                </div>
            </section>
        </div>
    );
};
export default PatientHomePage;