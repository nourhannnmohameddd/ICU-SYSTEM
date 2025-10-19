// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import DashBoardCard from '../components/DashBoardCard.jsx';
import AddHospital from './adminPages/AddHospital.jsx'; // Imported from subfolder
import ViewAllHospital from './adminPages/ViewAllHospital.jsx'; // Imported from subfolder
import styles from './AdminPage.module.css';
import { createAndAssignManager } from '../utils/api'; 

// --- Icon Setup (Assume Font Awesome or similar is installed) ---
const iconHospital = <i className="fas fa-hospital-alt"></i>; 
const iconManager = <i className="fas fa-user-tie"></i>;
const iconRating = <i className="fas fa-star-half-alt"></i>; 

const AdminPage = () => {
    // State to handle which content tab is visible
    const [activeTab, setActiveTab] = useState('viewHospitals'); 
    // State to force a reload in the hospital list when a new hospital is added
    const [hospitalUpdateKey, setHospitalUpdateKey] = useState(0); 
    const [managerForm, setManagerForm] = useState({ name: '', email: '', password: '', hospitalId: '' });
    const [managerMessage, setManagerMessage] = useState(null);

    // MOCK STATS: Fetch these from API in a real application
    const [dashboardStats, setDashboardStats] = useState({
        totalHospitals: 15,
        totalManagers: 8,
        avgRating: 4.2
    });
    
    // --- Handlers ---
    const handleHospitalAdded = (newHospitalData) => {
        // Optimistically update stats and trigger ViewAllHospital reload
        setDashboardStats(prev => ({ ...prev, totalHospitals: prev.totalHospitals + 1 }));
        setHospitalUpdateKey(prev => prev + 1);
        setActiveTab('viewHospitals'); // Switch back to view list
    };

    const handleManagerChange = (e) => {
        setManagerForm({ ...managerForm, [e.target.name]: e.target.value });
    };

    const handleManagerSubmit = async (e) => {
        e.preventDefault();
        setManagerMessage(null);
        try {
            // await createAndAssignManager(managerForm); // API call: create and assign managers
            setManagerMessage({ type: 'success', text: `Manager ${managerForm.name} created and assigned successfully!` });
            setDashboardStats(prev => ({ ...prev, totalManagers: prev.totalManagers + 1 }));
            setManagerForm({ name: '', email: '', password: '', hospitalId: '' });
        } catch (error) {
            setManagerMessage({ type: 'error', text: error.response?.data?.message || 'Failed to assign manager.' });
        }
    };
    
    // --- Content Renderer ---
    const renderContent = () => {
        switch (activeTab) {
            case 'addHospital':
                return <AddHospital onHospitalAdded={handleHospitalAdded} />;
            case 'manageManagers':
                return (
                    <form onSubmit={handleManagerSubmit} className={`${styles.formCard}`}>
                        <h3 className={styles.formTitle}>Create & Assign Manager</h3>
                        {managerMessage && <div className={managerMessage.type === 'error' ? styles.alertError : styles.alertSuccess}>{managerMessage.text}</div>}
                        <input type="text" name="name" value={managerForm.name} onChange={handleManagerChange} placeholder="Name" required />
                        <input type="email" name="email" value={managerForm.email} onChange={handleManagerChange} placeholder="Email" required />
                        <input type="password" name="password" value={managerForm.password} onChange={handleManagerChange} placeholder="Initial Password" required />
                        <input type="text" name="hospitalId" value={managerForm.hospitalId} onChange={handleManagerChange} placeholder="Assign to Hospital ID" required />
                        <button type="submit" className={styles.managerSubmitBtn}>Create & Assign Manager</button>
                    </form>
                );
            case 'viewHospitals':
            default:
                // Pass the key to force re-render when a new hospital is added
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

            {/* Navigation Tabs (Usability focused) */}
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