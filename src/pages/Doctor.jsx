// src/pages/Doctor.jsx
import React, { useState, useEffect } from 'react';
import { scheduleMedicines } from '../utils/api';
import styles from './Doctor.module.css';

const DoctorPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    // MOCK DATA: Load patients assigned to this doctor
    useEffect(() => {
        // In a real app: const response = await fetchMonitoredPatients();
        const mockPatients = [
            { id: 'p001', name: 'Patient A (ICU 1A)', condition: 'Stable, monitoring vitals', room: '1A', medHistory: 'Allergies: Penicillin', medSchedule: [{ med: 'Ibuprofen', dose: '10mg', time: '8:00 AM' }] },
            { id: 'p002', name: 'Patient B (ICU 2C)', condition: 'Critical, requires monitoring', room: '2C', medHistory: 'Asthma, Diabetes', medSchedule: [] },
        ];
        setPatients(mockPatients);
        setLoading(false);
    }, []);

    const handleScheduleMeds = async (e) => {
        e.preventDefault();
        const medData = { 
            patientId: selectedPatient.id,
            med: e.target.med.value,
            dose: e.target.dose.value,
            time: e.target.time.value
        };

        if (!selectedPatient) return;

        try {
            // await scheduleMedicines(medData.patientId, medData); // API Call
            alert(`Medicine scheduled for ${selectedPatient.name}.`);
            
            // Update local state to show the new schedule instantly
            setSelectedPatient(prev => ({ 
                ...prev, 
                medSchedule: [...prev.medSchedule, { med: medData.med, dose: medData.dose, time: medData.time }] 
            }));
            e.target.reset(); // Clear form
        } catch (error) {
            alert(`Failed to schedule medicine: ${error.message}`);
        }
    };

    if (loading) return <div className={styles.loading}>Loading patient monitoring dashboard...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Doctor's Patient Monitoring</h1>
            
            <div className={styles.contentGrid}>
                {/* Patient List (Left Column) */}
                <div className={styles.patientList}>
                    <h3>Patients on My Watch ({patients.length})</h3>
                    <ul className={styles.list}>
                        {patients.map(patient => (
                            <li 
                                key={patient.id} 
                                className={`${styles.listItem} ${selectedPatient?.id === patient.id ? styles.active : ''}`}
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <strong>{patient.name}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Patient Details & Meds (Right Column) */}
                <div className={styles.detailsPanel}>
                    {selectedPatient ? (
                        <>
                            <h2 className={styles.patientName}>{selectedPatient.name.split('(')[0]}</h2>
                            <p className={styles.roomInfo}>Current Condition: <span className={styles.status}>{selectedPatient.condition}</span></p>
                            
                            <div className={styles.detailCard}>
                                <h3 className={styles.subtitle}>Patient's Medical History</h3>
                                <div className={styles.historyBox}>
                                    {selectedPatient.medHistory || 'No detailed history available.'}
                                </div>
                            </div>
                            
                            <div className={styles.detailCard}>
                                <h3 className={styles.subtitle}>Current Medicine Schedule</h3>
                                <table className={styles.scheduleTable}>
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Medicine</th>
                                            <th>Dose</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPatient.medSchedule.length === 0 ? (
                                            <tr><td colSpan="3">No medicines scheduled yet.</td></tr>
                                        ) : (
                                            selectedPatient.medSchedule.map((med, index) => (
                                                <tr key={index}>
                                                    <td>{med.time}</td>
                                                    <td>{med.med}</td>
                                                    <td>{med.dose}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Schedule Medicine Form */}
                            <form onSubmit={handleScheduleMeds} className={styles.medForm}>
                                <h4>Schedule New Medicine</h4>
                                <input type="text" name="med" placeholder="Medicine Name" required />
                                <input type="text" name="dose" placeholder="Dosage (e.g., 5mg)" required />
                                <input type="time" name="time" required />
                                <button type="submit" className={styles.scheduleBtn}>Schedule</button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.placeholder}>← Select a patient to view and update their treatment.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DoctorPage;