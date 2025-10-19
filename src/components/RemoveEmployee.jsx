// src/components/RemoveEmployee.jsx
import React, { useState } from 'react';
import Button from './Button'; // 1. Import our Button component

const RemoveEmployee = ({ onEmployeeAction }) => {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to remove employee: ${identifier}?`)) {
        // In a real app: await deleteEmployee(identifier);
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
      {/* 2. Replace the old button with our new component */}
      <Button type="submit" variant="danger">
        Remove Employee
      </Button>
    </form>
  );
};

export default RemoveEmployee;