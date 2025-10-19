// src/utils/api.js
import axios from 'axios';
import { getToken, clearSession } from './cookieUtils';

// Base URL for the backend API (update to your backend server URL)
const API = axios.create({
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout requests after 10 seconds
});

// --- Request Interceptor: Attach JWT Token ---
API.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            // Attach token to Authorization header for every request
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Response Interceptor: Handle Global Errors (401, 403) ---
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Token expired or invalid
            console.error("Unauthorized request. Clearing session.");
            clearSession();
            // Redirect to login page (Note: This requires access to routing context, 
            // but for a utility file, we handle the cleanup and let the component handle redirect.)
        } else if (status === 403) {
            console.error("Forbidden access. User role unauthorized.");
        }
        return Promise.reject(error);
    }
);

// =================================================================
// --- API ENDPOINT FUNCTIONS ---
// =================================================================

// --- 1. AUTHENTICATION & USER MANAGEMENT ---
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerPatient = (userData) => API.post('/auth/register/patient', userData);

// --- 2. ICU & HOSPITAL (PATIENT VIEW) ---

/**
 * Fetches available ICUs based on patient location and filters.
 * @param {number} lat - Latitude of the user.
 * @param {number} lng - Longitude of the user.
 * @param {string} [specialization] - Optional filter by specialization.
 */
export const fetchAvailableICUs = ({ lat, lng, specialization, searchTerm }) => {
    return API.get('/icus/available', {
        params: { lat, lng, specialization, search: searchTerm }
    });
};

export const reserveICU = (icuId, patientId) => API.post('/reservations/icu', { icuId, patientId });
export const reserveVisitorsRoom = (details) => API.post('/reservations/visitor', details);
export const updateMedicalHistory = (patientId, history) => API.put(`/patients/${patientId}/history`, history);
export const rateDoctorAndHospital = (data) => API.post('/ratings', data);

// --- 3. HOSPITAL MANAGEMENT (ADMIN/MANAGER) ---

// Admin: Hospital Management
export const addHospital = (data) => API.post('/admin/hospitals', data);
export const viewAllHospitals = () => API.get('/admin/hospitals');
export const blockHospital = (hospitalId) => API.put(`/admin/hospitals/${hospitalId}/block`);
export const viewHospitalRating = (hospitalId) => API.get(`/admin/hospitals/${hospitalId}/rating`);

// Manager: ICU & Employee Management
export const registerICU = (icuData) => API.post('/manager/icus', icuData);
export const viewHospitalICUs = (hospitalId) => API.get(`/manager/hospitals/${hospitalId}/icus`);
export const deleteICU = (icuId) => API.delete(`/manager/icus/${icuId}`);
export const addEmployee = (employeeData) => API.post('/manager/employees', employeeData);
export const deleteEmployee = (employeeId) => API.delete(`/manager/employees/${employeeId}`);
export const assignTask = (taskData) => API.post('/manager/tasks', taskData);
export const trackEmployeeTasks = (employeeId) => API.get(`/manager/tasks/employee/${employeeId}`);
export const registerKidsArea = (data) => API.post('/manager/kidsarea', data);
export const approveVacation = (vacationId) => API.put(`/manager/vacations/${vacationId}/approve`);

// --- 4. EMPLOYEE/DOCTOR/NURSE ACTIONS ---

export const updateTaskStatus = (taskId, newStatus) => API.put(`/employee/tasks/${taskId}/status`, { newStatus });
export const uploadHealthReport = (patientId, reportData) => API.post(`/nurse/patients/${patientId}/report`, reportData);
export const scheduleMedicines = (patientId, schedule) => API.post(`/doctor/patients/${patientId}/meds`, schedule);

// Export API instance for direct use in complex cases
export default API;