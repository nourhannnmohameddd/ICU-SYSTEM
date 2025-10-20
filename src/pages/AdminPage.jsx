// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // 1. Import toast
import DashBoardCard from '../components/DashBoardCard.jsx';
import AddHospital from './adminPages/AddHospital.jsx';
import ViewAllHospital from './adminPages/ViewAllHospital.jsx';
import styles from './AdminPage.module.css';
import { createAndAssignManager } from '../utils/api'; 

// --- Icon Setup ---
const iconHospital = <i className="fas fa-hospital-alt"></i>; 
const iconManager = <i className="fas fa-user-tie"></i>;
const iconRating = <i className="fas fa-star-half-alt"></i>; 

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('viewHospitals'); 
    const [hospitalUpdateKey, setHospitalUpdateKey] = useState(0); 
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '', hospitalId: '' });
    
    // 2. The managerMessage state is no longer needed
    // const [managerMessage, setManagerMessage] = useState(null);

    const [dashboardStats, setDashboardStats] = useState({
        totalHospitals: 15,
        totalManagers: 8,
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
        try {
            // await createAndAssignManager(managerForm); 
            
            // 3. Show a success toast
            toast.success(`Manager ${managerForm.name} created and assigned successfully!`);
            
            setDashboardStats(prev => ({ ...prev, totalManagers: prev.totalManagers + 1 }));
            setManagerForm({ name: '', email: '', password: '', hospitalId: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to assign manager.';
            
            // 4. Show an error toast
            toast.error(errorMessage);
        }
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'addHospital':
                return <AddHospital onHospitalAdded={handleHospitalAdded} />;
            case 'manageManagers':
                return (
                    <form onSubmit={handleManagerSubmit} className={`${styles.formCard}`}>
                        <h3 className={styles.formTitle}>Create & Assign Manager</h3>
                        
                        {/* 5. The old message div is removed from here */}

                        <input type="text" name="name" value={managerForm.name} onChange={handleManagerChange} placeholder="Name" required />
                        <input type="email" name="email" value={managerForm.email} onChange={handleManagerChange} placeholder="Email" required />
                        <input type="password" name="password" value={managerForm.password} onChange={handleManagerChange} placeholder="Initial Password" required />
                        <input type="text" name="hospitalId" value={managerForm.hospitalId} onChange={handleManagerChange} placeholder="Assign to Hospital ID" required />
                        <button type="submit" className={styles.managerSubmitBtn}>Create & Assign Manager</button>
                    </form>
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

            {/* Dashboard Statistics */}
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
                    title="Avg. Hospital Rating" 
                    value={dashboardStats.avgRating.toFixed(1)} 
                    icon={iconRating} 
                    color="#28a745"
                />
            </section>

            {/* Navigation Tabs */}
            <nav className={styles.tabsNav}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'viewHospitals' ? styles.active : ''}`}
                    onClick={() => setActiveTab('viewHospitals')}
                >
                    View & Manage Hospitals
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'addHospital' ? styles.active : ''}`}
                    onClick={() => setActiveTab('addHospital')}
                >
                    Add New Hospital
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'manageManagers' ? styles.active : ''}`}
                    onClick={() => setActiveTab('manageManagers')}
                >
                    Create & Assign Managers
                </button>
            </nav>

            {/* Dynamic Content Area */}
            <section className={styles.contentArea}>
                {renderContent()}
            </section>
        </div>
    );
};

export default AdminPage;