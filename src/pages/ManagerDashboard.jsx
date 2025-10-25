import React, { useState, useEffect } from 'react';
import DashBoardCard from '../components/DashBoardCard.jsx';
import Addicu from './managerPages/Addicu.jsx';
import EmployeeMgmt from './EmployeeMgmt.jsx';
import VacationRequests from './VacationRequests.jsx';
import ICUMgmt from './ICUMgmt.jsx'; // Central ICU table management
import styles from './ManagerDashboard.module.css';
import navStyles from './AppNav.module.css'; // Using the AppNav.module.css we fixed

// --- Icon Setup ---
const iconICU = <i className="fas fa-bed"></i>;
const iconTasks = <i className="fas fa-tasks"></i>;
const iconVacation = <i className="fas fa-calendar-check"></i>;
const iconEmployee = <i className="fas fa-user-friends"></i>;

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [hospitalInfo, setHospitalInfo] = useState({ id: 'HOSP_XYZ', name: 'General City Clinic' });

    // MOCK DATA: Fetch these from API in a real application
    const [dashboardStats, setDashboardStats] = useState({
        totalICUs: 25,
        availableICUs: 12,
        pendingVacations: 3,
        employeesOnShift: 45
    });

    // --- Handlers ---
    const handleIcuRegistered = (newIcu) => {
        setDashboardStats(prev => ({ ...prev, totalICUs: prev.totalICUs + 1, availableICUs: prev.availableICUs + 1 }));
        setActiveTab('icuMgmt');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'icuMgmt':
                return <ICUMgmt hospitalId={hospitalInfo.id} />;
            case 'addIcu':
                return <Addicu hospitalId={hospitalInfo.id} onIcuRegistered={handleIcuRegistered} />;
            case 'employeeMgmt':
                // Pass the role down to the generic EmployeeMgmt page component
                return <EmployeeMgmt employeeRole="Manager" />;
            case 'vacations':
                return <VacationRequests hospitalId={hospitalInfo.id} />;
            case 'visitorsKids':
                // Placeholder for Visitor/Kids area management (Requires separate component implementation)
                return <div className={styles.sectionPlaceholder}><h3>Visitors' Room & Kids Area Management</h3><p>Implementation pending: Forms to register rooms, determine fees, and view occupancy.</p></div>;
            case 'overview':
            default:
                return (
                    <div className={styles.overviewPanel}>
                        <h3 className={styles.sectionTitle}>Hospital Overview</h3>
                        <p>Welcome back, Manager! You are managing: **{hospitalInfo.name} ({hospitalInfo.id})**</p>
                        <div className={styles.quickActions}>
                            <button onClick={() => setActiveTab('employeeMgmt')}>Manage Employees & Tasks</button>
                            <button onClick={() => setActiveTab('addIcu')}>Register New ICU</button>
                        </div>
                    </div>
                );
        }
    };
    return (
        <div className={styles.managerDashboard}>
            <header className={styles.header}>
                <h1>{hospitalInfo.name} Manager Dashboard</h1>
            </header>

            {/* Statistics Grid */}
            <section className={styles.statsGrid}>
                <DashBoardCard
                    title="Available ICUs"
                    value={dashboardStats.availableICUs}
                    icon={iconICU}
                    color="#28a745" // Green
                />
                <DashBoardCard
                    title="Total Employees"
                    value={dashboardStats.employeesOnShift}
                    icon={iconEmployee}
                    color="#17a2b8" // Cyan
                />
                <DashBoardCard
                    title="Pending Vacations"
                    value={dashboardStats.pendingVacations}
                    icon={iconVacation}
                    color="#ffc107" // Yellow
                />
                <DashBoardCard
                    title="Total ICUs"
                    value={dashboardStats.totalICUs}
                    icon={iconICU}
                    color="#007bff" // Blue
                />
            </section>

            {/* Navigation Tabs */}
            <nav className={navStyles.navContainer}>
                <button className={`${navStyles.navButton} ${activeTab === 'overview' ? navStyles.active : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`${navStyles.navButton} ${activeTab === 'icuMgmt' || activeTab === 'addIcu' ? navStyles.active : ''}`} onClick={() => setActiveTab('icuMgmt')}>ICU Management</button>
                <button className={`${navStyles.navButton} ${activeTab === 'employeeMgmt' ? navStyles.active : ''}`} onClick={() => setActiveTab('employeeMgmt')}>Employee & Tasks</button>
                <button className={`${navStyles.navButton} ${activeTab === 'vacations' ? navStyles.active : ''}`} onClick={() => setActiveTab('vacations')}>Vacation Requests</button>
                <button className={`${navStyles.navButton} ${activeTab === 'visitorsKids' ? navStyles.active : ''}`} onClick={() => setActiveTab('visitorsKids')}>Auxiliary Mgmt</button>
            </nav>

            {/* Dynamic Content */}
            <section className={styles.contentArea}>
                {renderContent()}
            </section>
        </div>
    );
};
export default ManagerDashboard;