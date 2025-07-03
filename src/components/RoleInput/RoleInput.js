import React from 'react';
import './RoleInput.css';

const RoleInput = ({ value, onChange }) => {
  return (
    <div className="role-input-container">
      <label htmlFor="role-select">Role</label>
      <select 
        id="role-select"
        className="role-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="Melee">Melee</option>
        <option value="Ranged">Ranged</option>
        <option value="Hybrid">Hybrid</option>
      </select>
    </div>
  );
};

export default RoleInput;
