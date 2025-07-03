import React from 'react';
import './ArmamentInput.css';

const ArmamentInput = ({ value, onChange }) => {
  return (
    <div className="armament-input-wrapper">
      <div className="armament-input-label">Armament</div>
      <select
        className="armament-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-</option>
        <option value="Complex Matériel">Complex Matériel</option>
        <option value="Simple Matériel">Simple Matériel</option>
        <option value="Innate">Innate</option>
      </select>
    </div>
  );
};

export default ArmamentInput;
