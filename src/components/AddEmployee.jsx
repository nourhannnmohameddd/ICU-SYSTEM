// src/components/AddEmployee.jsx
import React, { useState } from 'react';
import Button from './Button'; // 1. Import our Button component

const AddEmployee = ({ onEmployeeAction }) => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', role: 'nurse', password: '' 
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app: const result = await addEmployee(formData);
    onEmployeeAction({ ...formData, id: Date.now() }, 'added');
    setFormData({ name: '', email: '', role: 'nurse', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>Add New Employee</h3>
      <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" required />
      <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required />
      <select name="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
        <option value="cleaner">Cleaner</option>
        <option value="receptionist">Receptionist</option>
        <option value="manager">Manager (Admin Only)</option>
      </select>
      {/* 2. Replace the old button with our new component */}
      <Button type="submit" variant="primary">
        Add Employee
      </Button>
    </form>
  );
};
export default AddEmployee;