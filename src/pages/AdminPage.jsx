// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DashBoardCard from '../components/DashBoardCard.jsx';
import AddHospital from './adminPages/AddHospital.jsx';
import ViewAllHospital from './adminPages/ViewAllHospital.jsx';
import styles from './AdminPage.module.css';
import Button from '../components/Button';

// --- NEW: Import Employee Management Components ---
import AddEmployee from '../components/AddEmployee.jsx';
import RemoveEmployee from '../components/RemoveEmployee.jsx';

const iconHospital = <i className="fas fa-hospital-alt"></i>; 
const iconManager = <i className="fas fa-user-tie"></i>;
const iconRating = <i className="fas fa-star-half-alt"></i>; 
const iconEmployee = <i className="fas fa-users"></i>;

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('viewHospitals'); 
    const [hospitalUpdateKey, setHospitalUpdateKey] = useState(0); 
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '', hospitalId: '' });
    
    const [dashboardStats, setDashboardStats] = useState({
        totalHospitals: 15,
        totalManagers: 8,
        totalEmployees: 124,
        avgRating: 4.2
    });
    
    const handleHospitalAdded = (newHospitalData) => {
        setDashboardStats(prev => ({ ...prev, totalHospitals: prev.totalHospitals + 1 }));
        setHospitalUpdateKey(prev => prev + 1);
        setActiveTab('viewHospitals');
    };

    const handleManagerChange = (e) => {
        setManagerForm({ ...managerForm, [e.target.name]: e.target.value });
    };

    const handleManagerSubmit = async (e) => {
        e.preventDefault();
        toast.success(`Manager ${managerForm.name} created and assigned successfully!`);
        setDashboardStats(prev => ({ ...prev, totalManagers: prev.totalManagers + 1 }));
        setManagerForm({ name: '', email: '', password: '', hospitalId: '' });
    };

    // --- NEW: Handler for employee actions to provide feedback ---
    const handleEmployeeAction = (employee, action) => {
        if (action === 'added') {
            toast.success(`Employee "${employee.name}" was successfully added!`);
            setDashboardStats(prev => ({...prev, totalEmployees: prev.totalEmployees + 1}));
        }
        if (action === 'removed') {
            // NOTE: The 'employee' here is just the identifier string from the form
            toast.error(`Employee "${employee}" was removed.`);
            setDashboardStats(prev => ({...prev, totalEmployees: prev.totalEmployees - 1}));
        }
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'addHospital':
                return <AddHospital onHospitalAdded={handleHospitalAdded} />;
            case 'manageManagers':
                return (
                    <form onSubmit={handleManagerSubmit} className={styles.formCard}>
                        <h3 className={styles.formTitle}>Add & Assign Manager</h3>
                        <input type="text" name="name" value={managerForm.name} onChange={handleManagerChange} placeholder="Name" required />
                        <input type="email" name="email" value={managerForm.email} onChange={handleManagerChange} placeholder="Email" required />
                        <input type="password" name="password" value={managerForm.password} onChange={handleManagerChange} placeholder="Initial Password" required />
                        <input type="text" name="hospitalId" value={managerForm.hospitalId} onChange={handleManagerChange} placeholder="Assign to Hospital ID" required />
                        <Button type="submit" variant="primary">Add & Assign Manager</Button>
                    </form>
                );
            // --- NEW: Case for Employee Management ---
            case 'manageEmployees':
                return (
                    <div className={styles.employeeMgmtGrid}>
                        <AddEmployee onEmployeeAction={handleEmployeeAction} />
                        <RemoveEmployee onEmployeeAction={handleEmployeeAction} />
                    </div>
                );
            case 'viewHospitals':
            default:
                return <ViewAllHospital key={hospitalUpdateKey} />;
        }
    };

    return (
        <div className={styles.adminDashboard}>
            <header className={styles.header}>
                <h1>System Administrator Dashboard</h1>
            </header>

            <section className={styles.statsGrid}>
                <DashBoardCard 
                    title="Total Hospitals" 
                    value={dashboardStats.totalHospitals} 
                    icon={iconHospital} 
                    color="#007bff"
                />
                <DashBoardCard 
                    title="Total Managers" 
                    value={dashboardStats.totalManagers} 
                    icon={iconManager} 
                    color="#ffc107"
                />
                <DashBoardCard 
                    title="Total Employees" 
                    value={dashboardStats.totalEmployees} 
                    icon={iconEmployee} 
                    color="#17a2b8"
                />
                <DashBoardCard 
                    title="Avg. Hospital Rating" 
                    value={dashboardStats.avgRating.toFixed(1)} 
                    icon={iconRating} 
                    color="#28a745"
                />
            </section>

            <nav className={styles.tabsNav}>
                <Button className={`${styles.tabButton} ${activeTab === 'viewHospitals' ? styles.active : ''}`} onClick={() => setActiveTab('viewHospitals')}>
                    Manage Hospitals
                </Button>
                <Button className={`${styles.tabButton} ${activeTab === 'addHospital' ? styles.active : ''}`} onClick={() => setActiveTab('addHospital')}>
                    Add Hospital
                </Button>
                {/* --- NEW: Employee Management Tab --- */}
                <Button className={`${styles.tabButton} ${activeTab === 'manageEmployees' ? styles.active : ''}`} onClick={() => setActiveTab('manageEmployees')}>
                    Manage Employees
                </Button>
                <Button className={`${styles.tabButton} ${activeTab === 'manageManagers' ? styles.active : ''}`} onClick={() => setActiveTab('manageManagers')}>
                    Add Manager
                </Button>
            </nav>

            <section className={styles.contentArea}>
                {renderContent()}
            </section>
        </div>
    );
};

export default AdminPage;