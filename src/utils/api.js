// src/utils/api.js
import axios from 'axios';
import { getToken, clearSession } from './cookieUtils';

// ============================================================
// ✅ Base URL for the backend API
// Update 'localhost:3000' if your backend runs elsewhere
// ============================================================
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// ============================================================
// ✅ Request Interceptor — attach JWT Token
// ============================================================
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// ✅ Response Interceptor — handle 401 / 403 globally
// ============================================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      console.error('Unauthorized request. Clearing session.');
      clearSession();
      // Optional: redirect to login if router available
    } else if (status === 403) {
      console.error('Forbidden access. User not authorized.');
    }
    return Promise.reject(error);
  }
);

// ============================================================
// ✅ API FUNCTIONS
// ============================================================

// --- 1. AUTHENTICATION ---
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerPatient = (userData) => API.post('/auth/register/patient', userData);

// --- 2. PATIENT & ICU OPERATIONS ---
export const fetchAvailableICUs = ({ lat, lng, specialization, searchTerm }) => {
  return API.get('/icus/available', {
    params: { lat, lng, specialization, search: searchTerm },
  });
};

export const reserveICU = (icuId, patientId) => API.post('/reservations/icu', { icuId, patientId });
export const reserveVisitorsRoom = (details) => API.post('/reservations/visitor', details);
export const updateMedicalHistory = (patientId, history) =>
  API.put(`/patients/${patientId}/history`, history);
export const rateDoctorAndHospital = (data) => API.post('/ratings', data);

// --- 3. HOSPITAL MANAGEMENT (ADMIN/MANAGER) ---
export const addHospital = (data) => API.post('/admin/hospitals', data);
export const viewAllHospitals = () => API.get('/admin/hospitals');
export const blockHospital = (hospitalId) => API.put(`/admin/hospitals/${hospitalId}/block`);
export const viewHospitalRating = (hospitalId) => API.get(`/admin/hospitals/${hospitalId}/rating`);

// ✅ NEW: Admin creates and assigns manager to a hospital
export const createAndAssignManager = (managerData) =>
  API.post('/admin/managers', managerData);

// Manager operations
export const registerICU = (icuData) => API.post('/manager/icus', icuData);
export const viewHospitalICUs = (hospitalId) => API.get(`/manager/hospitals/${hospitalId}/icus`);
export const deleteICU = (icuId) => API.delete(`/manager/icus/${icuId}`);
export const addEmployee = (employeeData) => API.post('/manager/employees', employeeData);
export const deleteEmployee = (employeeId) => API.delete(`/manager/employees/${employeeId}`);
export const assignTask = (taskData) => API.post('/manager/tasks', taskData);
export const trackEmployeeTasks = (employeeId) => API.get(`/manager/tasks/employee/${employeeId}`);
export const registerKidsArea = (data) => API.post('/manager/kidsarea', data);
export const approveVacation = (vacationId) => API.put(`/manager/vacations/${vacationId}/approve`);

// --- 4. EMPLOYEE / DOCTOR / NURSE ACTIONS ---
export const updateTaskStatus = (taskId, newStatus) =>
  API.put(`/employee/tasks/${taskId}/status`, { newStatus });

export const uploadHealthReport = (patientId, reportData) =>
  API.post(`/nurse/patients/${patientId}/report`, reportData);

export const scheduleMedicines = (patientId, schedule) =>
  API.post(`/doctor/patients/${patientId}/meds`, schedule);

// ✅ Added new requestVacation function (missing before)
export const requestVacation = (vacationData) =>
  API.post('/employee/vacations', vacationData);

// Export API instance (optional use)
export default API;
