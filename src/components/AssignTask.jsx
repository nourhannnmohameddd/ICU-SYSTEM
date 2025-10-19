// src/components/AssignTask.jsx
import React, { useState } from 'react';
// import { assignTask } from '../utils/api'; // API function

// employees: [{ id, name, role }]
const AssignTask = ({ employees = [], onTaskAssigned }) => {
  const [formData, setFormData] = useState({ 
    employeeId: '', description: '', priority: 'Medium', deadline: '' 
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // 1. Call API: const result = await assignTask(formData);
      
      // MOCK Success:
      const result = { success: true, task: { id: Date.now(), ...formData } }; 

      if (result.success) {
        setMessage(`Task successfully assigned to Employee ID ${formData.employeeId}.`);
        onTaskAssigned(result.task); 
        setFormData({ employeeId: '', description: '', priority: 'Medium', deadline: '' });
      }
    } catch (error) {
      setMessage(`Error assigning task: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>Assign Task</h3>
      {message && <div className={message.includes('Error') ? 'alert-error' : 'alert-success'}>{message}</div>}
      
      <label htmlFor="employeeId">Assign To:</label>
      <select id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleChange} required>
        <option value="">-- Select Employee --</option>
        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
      </select>

      <label htmlFor="description">Description:</label>
      <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Task details (e.g., Clean Room 302)" required />

      <label htmlFor="priority">Priority:</label>
      <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <label htmlFor="deadline">Deadline:</label>
      <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} required />
      
      <button type="submit" className="btn-primary">Assign Task</button>
    </form>
  );
};
export default AssignTask;