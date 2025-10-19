// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Global Components ---
import Navigation from './components/Navigation.jsx'; 
// Assuming you have a Footer component, which is good practice for usability
// import Footer from './components/Footer.jsx'; 

// --- Utilities & Security ---
import PrivateRoute from './pages/PrivateRoute.jsx'; 
import socket from './socket';

// --- Import All Pages ---
import LandingPage from './pages/LandingPage.jsx';
import ICUSelect from './pages/ICUSelect.jsx';
import LoginForm from './pages/LoginForm.jsx';
import RegisterForm from './pages/RegisterForm.jsx';
import PatientHomePage from './pages/PatientHomePage.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DoctorPage from './pages/Doctor.jsx'; 
import EmployeePage from './pages/EmployeeMgmt.jsx'; // Generic base for employees
import PageNotFound from './pages/PageNotFound.jsx'; 


const App = () => {

    useEffect(() => {
        // --- Global Socket Connection Management ---
        // Connect the socket when the application starts. Components (like ICUSelect) 
        // will handle their specific listeners.
        if (!socket.connected) {
             socket.connect(); 
        }
        
        return () => {
             // Clean up the global socket connection when the app component unmounts
             if (socket.connected) {
                socket.disconnect();
             }
        };
    }, []);

    return (
        <div id="app-container">
            <Navigation />
            <main>
                <Routes>
                    
                    {/* --- PUBLIC ROUTES --- */}
                    {/* The root path is essential for resolving the 404 error */}
                    <Route path="/" element={<LandingPage />} /> 
                    <Route path="/find-icu" element={<ICUSelect />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    
                    {/* --- PATIENT/ENDUSER ROUTES (Role: patient) --- */}
                    <Route 
                        path="/patient-dashboard" 
                        element={
                            <PrivateRoute allowedRoles={['patient']}>
                                <PatientHomePage />
                            </PrivateRoute>
                        } 
                    />
                    
                    {/* --- ADMIN ROUTE (Role: admin) --- */}
                    <Route 
                        path="/admin" 
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminPage />
                            </PrivateRoute>
                        } 
                    />

                    {/* --- MANAGER ROUTE (Role: manager) --- */}
                    <Route 
                        path="/manager" 
                        element={
                            <PrivateRoute allowedRoles={['manager']}>
                                <ManagerDashboard />
                            </PrivateRoute>
                        } 
                    />

                    {/* --- DOCTOR ROUTE (Role: doctor) --- */}
                    <Route 
                        path="/doctor" 
                        element={
                            <PrivateRoute allowedRoles={['doctor']}>
                                <DoctorPage />
                            </PrivateRoute>
                        } 
                    />

                    {/* --- EMPLOYEE ROLE ROUTES (Using Generic EmployeePage component) --- */}
                    {/* The EmployeePage component receives the role via a prop for specialized content */}
                    <Route 
                        path="/nurse" 
                        element={
                            <PrivateRoute allowedRoles={['nurse']}>
                                <EmployeePage employeeRole="Nurse" />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/receptionist" 
                        element={
                            <PrivateRoute allowedRoles={['receptionist']}>
                                <EmployeePage employeeRole="Receptionist" />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/cleaner" 
                        element={
                            <PrivateRoute allowedRoles={['cleaner']}>
                                <EmployeePage employeeRole="Cleaner" />
                            </PrivateRoute>
                        } 
                    />

                    {/* --- CATCH-ALL ROUTE (MUST BE LAST) --- */}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </main>
            {/* <Footer /> */} 
        </div>
    );
};

export default App;