// src/pages/EmployeeMgmt.jsx
import React, { useState, useEffect } from 'react';
import { updateTaskStatus, requestVacation } from '../utils/api';
import styles from './EmployeeMggmt.module.css'; 
import Button from '../components/Button'; // 1. Import Button

const EmployeePage = ({ employeeRole = 'Employee' }) => {
    const [tasks, setTasks] = useState([]);
    const [kidsAreaStatus, setKidsAreaStatus] = useState('0/5');
    const [vacationForm, setVacationForm] = useState({ start: '', end: '', reason: '' });

    useEffect(() => {
        const mockTasks = [
            { id: 't1', description: 'Clean Room 301', status: 'PENDING', category: 'Cleaner' },
            { id: 't2', description: 'Monitor vital signs for Patient 10A', status: 'IN_PROGRESS', category: 'Nurse' },
            { id: 't3', description: 'Check-in Patient arrival', status: 'DONE', category: 'Receptionist' },
        ];
        setTasks(mockTasks.filter(t => t.category.toLowerCase() === employeeRole.toLowerCase()));
    }, [employeeRole]);

    const handleTaskStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : 'DONE';
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };
    
    const handleVacationRequest = async (e) => {
        e.preventDefault();
        alert('Vacation request submitted successfully.');
        setVacationForm({ start: '', end: '', reason: '' });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{employeeRole.toUpperCase()} Dashboard</h1>
            
            <section className={styles.taskSection}>
                <h2>My Assigned Tasks ({tasks.filter(t => t.status !== 'DONE').length} Pending)</h2>
                <ul className={styles.taskList}>
                    {tasks.map(task => (
                        <li key={task.id} className={`${styles.taskItem} ${styles[`status${task.status}`]}`}>
                            <span>{task.description}</span>
                            <div className={styles.taskActions}>
                                <span className={styles.statusBadge}>{task.status.replace('_', ' ')}</span>
                                {/* 2. Replace button */}
                                <Button 
                                    onClick={() => handleTaskStatusChange(task.id, task.status)}
                                    disabled={task.status === 'DONE'}
                                    variant="primary"
                                    className={styles.actionBtn}
                                >
                                    {task.status === 'PENDING' ? 'Start' : task.status === 'IN_PROGRESS' ? 'Done' : 'Completed'}
                                </Button>
                                {task.category === 'Cleaner' && task.status === 'DONE' && (
                                     <Button className={`${styles.actionBtn} ${styles.btnSterilize}`}>Mark Sterilized</Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            
            {(employeeRole === 'Nurse' || employeeRole === 'Receptionist') && (
                <section className={styles.statusSection}>
                    <h2>Kids Area Status</h2>
                    <p className={styles.kidsStatus}>Occupancy: <strong>{kidsAreaStatus}</strong></p>
                    {/* 2. Replace button */}
                    <Button className={styles.btnReserveSlot}>Reserve Time Slot</Button>
                </section>
            )}

            <section className={styles.vacationSection}>
                <h2>Request Vacation/Leave</h2>
                <form onSubmit={handleVacationRequest} className={styles.vacationForm}>
                    <input type="date" name="start" value={vacationForm.start} onChange={(e) => setVacationForm({...vacationForm, start: e.target.value})} required />
                    <input type="date" name="end" value={vacationForm.end} onChange={(e) => setVacationForm({...vacationForm, end: e.target.value})} required />
                    <textarea name="reason" value={vacationForm.reason} onChange={(e) => setVacationForm({...vacationForm, reason: e.target.value})} placeholder="Reason for leave" required />
                    {/* 2. Replace button */}
                    <Button type="submit" variant="secondary">Submit Request</Button>
                </form>
            </section>
        </div>
    );
};

export default EmployeePage;