// src/pages/EmployeeMgmt.jsx
// This file acts as the generic dashboard for Nurse, Cleaner, Employee roles.
import React, { useState, useEffect } from 'react';
import { updateTaskStatus, requestVacation } from '../utils/api';
import styles from './EmployeeMgmt.module.css'; 

const EmployeePage = ({ employeeRole = 'Employee' }) => {
    const [tasks, setTasks] = useState([]);
    const [kidsAreaStatus, setKidsAreaStatus] = useState('0/5'); // For Nurse/Receptionist
    const [vacationForm, setVacationForm] = useState({ start: '', end: '', reason: '' });

    // MOCK DATA: Load tasks for the current employee
    useEffect(() => {
        // In a real app: const response = await fetchEmployeeTasks();
        const mockTasks = [
            { id: 't1', description: 'Clean Room 301', status: 'PENDING', category: 'Cleaner' },
            { id: 't2', description: 'Monitor vital signs for Patient 10A', status: 'IN_PROGRESS', category: 'Nurse' },
            { id: 't3', description: 'Check-in Patient arrival', status: 'DONE', category: 'Receptionist' },
        ];
        // Filter tasks based on the role using case-insensitive check
        setTasks(mockTasks.filter(t => t.category.toLowerCase() === employeeRole.toLowerCase()));
    }, [employeeRole]);

    const handleTaskStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : 'DONE';
        try {
            // await updateTaskStatus(taskId, newStatus); // API Call
            // Update state
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        } catch (error) {
            alert('Failed to update task status.');
        }
    };
    
    const handleVacationRequest = async (e) => {
        e.preventDefault();
        try {
            // await requestVacation({ ...vacationForm, employeeRole }); // API Call
            alert('Vacation request submitted successfully.');
            setVacationForm({ start: '', end: '', reason: '' });
        } catch (error) {
            alert('Failed to submit vacation request.');
        }
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
                                <button 
                                    onClick={() => handleTaskStatusChange(task.id, task.status)}
                                    disabled={task.status === 'DONE'}
                                    className={task.status === 'DONE' ? styles.btnDisabled : styles.btnPrimary}
                                >
                                    {task.status === 'PENDING' ? 'Start Task' : task.status === 'IN_PROGRESS' ? 'Mark Done' : 'Completed'}
                                </button>
                                {/* Cleaner specific action */}
                                {task.category === 'Cleaner' && task.status === 'DONE' && (
                                     <button className={styles.btnSterilize}>Mark Sterilized</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            
            {/* Conditional Sections based on Role */}
            {(employeeRole === 'Nurse' || employeeRole === 'Receptionist') && (
                <section className={styles.statusSection}>
                    <h2>Kids Area Status</h2>
                    <p className={styles.kidsStatus}>Occupancy: <strong>{kidsAreaStatus}</strong> (Reserve time slots for patients)</p>
                    <button className={styles.btnReserveSlot}>Reserve Time Slot</button>
                </section>
            )}

            <section className={styles.vacationSection}>
                <h2>Request Vacation/Leave</h2>
                <form onSubmit={handleVacationRequest} className={styles.vacationForm}>
                    <input type="date" name="start" value={vacationForm.start} onChange={(e) => setVacationForm({...vacationForm, start: e.target.value})} placeholder="Start Date" required />
                    <input type="date" name="end" value={vacationForm.end} onChange={(e) => setVacationForm({...vacationForm, end: e.target.value})} placeholder="End Date" required />
                    <textarea name="reason" value={vacationForm.reason} onChange={(e) => setVacationForm({...vacationForm, reason: e.target.value})} placeholder="Reason for leave" required />
                    <button type="submit" className={styles.btnSecondary}>Submit Request</button>
                </form>
            </section>
        </div>
    );
};

export default EmployeePage;