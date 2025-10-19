import React, { useState } from 'react';
// import { addEmployee } from '../utils/api'; 

const AddEmployee = ({ onEmployeeAction }) => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', role: 'nurse', password: '' 
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Call API: const result = await addEmployee(formData);
    // 2. onEmployeeAction(result.data, 'added');
    onEmployeeAction({ ...formData, id: Date.now() }, 'added');
    setFormData({ name: '', email: '', role: 'nurse', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>Add New Employee</h3>
      <input type="text" name="name" onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" required />
      <input type="email" name="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" required />
      <input type="password" name="password" onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" required />
      <select name="role" onChange={(e) => setFormData({...formData, role: e.target.value})}>
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
        <option value="cleaner">Cleaner</option>
        <option value="receptionist">Receptionist</option>
        <option value="manager">Manager (Admin Only)</option>
      </select>
      <button type="submit" className="btn-primary">Add Employee</button>
    </form>
  );
};
export default AddEmployee;