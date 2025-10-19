import React, { useState } from 'react';
// import { deleteEmployee } from '../utils/api';

const RemoveEmployee = ({ onEmployeeAction }) => {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to remove employee: ${identifier}?`)) {
        // 1. Call API: await deleteEmployee(identifier);
        onEmployeeAction(identifier, 'removed');
        setIdentifier('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h3>Remove Employee</h3>
      <input 
        type="text" 
        value={identifier} 
        onChange={(e) => setIdentifier(e.target.value)} 
        placeholder="Employee ID or Email" 
        required 
      />
      <button type="submit" className="btn-danger">Remove Employee</button>
    </form>
  );
};
export default RemoveEmployee;