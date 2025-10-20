// src/pages/Doctor.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // 1. Import toast
import { scheduleMedicines } from '../utils/api';
import styles from './Doctor.module.css';
import Button from '../components/Button';

const DoctorPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    // MOCK DATA
    useEffect(() => {
        const mockPatients = [
            { id: 'p001', name: 'Patient A (ICU 1A)', condition: 'Stable, monitoring vitals', room: '1A', medHistory: 'Allergies: Penicillin', medSchedule: [{ med: 'Ibuprofen', dose: '10mg', time: '08:00' }] },
            { id: 'p002', name: 'Patient B (ICU 2C)', condition: 'Critical, requires monitoring', room: '2C', medHistory: 'Asthma, Diabetes', medSchedule: [] },
        ];
        setPatients(mockPatients);
        setLoading(false);
    }, []);

    // 2. Updated handler for real-time UI and toast notifications
    const handleScheduleMeds = async (e) => {
        e.preventDefault();

        // Get data directly from the form fields
        const formData = new FormData(e.target);
        const newMed = {
            med: formData.get('med'),
            dose: formData.get('dose'),
            time: formData.get('time'),
        };

        // Update the state to reflect the change immediately
        setPatients(currentPatients =>
            currentPatients.map(patient => {
                if (patient.id === selectedPatient.id) {
                    // This is the patient to update. Return a new object.
                    return {
                        ...patient,
                        medSchedule: [...patient.medSchedule, newMed],
                    };
                }
                // This is not the patient we're looking for, return it unchanged.
                return patient;
            })
        );
        
        // Also update the 'selectedPatient' state so the view refreshes if it's separate
        setSelectedPatient(prev => ({
             ...prev,
             medSchedule: [...prev.medSchedule, newMed]
        }));


        // Show a success toast
        toast.success(`Medicine scheduled for ${selectedPatient.name}.`);

        // Reset the form for the next entry
        e.target.reset();
    };

    if (loading) return <div className={styles.loading}>Loading patient monitoring dashboard...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Doctor's Patient Monitoring</h1>
            
            <div className={styles.contentGrid}>
                {/* Patient List */}
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

                {/* Patient Details & Meds */}
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

                            <form onSubmit={handleScheduleMeds} className={styles.medForm}>
                                <h4>Schedule New Medicine</h4>
                                <input type="text" name="med" placeholder="Medicine Name" required />
                                <input type="text" name="dose" placeholder="Dosage (e.g., 5mg)" required />
                                <input type="time" name="time" required />
                                <Button type="submit" variant="primary" className={styles.scheduleBtn}>
                                    Schedule
                                </Button>
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