import React from 'react';
import './ZoneInput.css';

const ZoneInput = ({ value, onChange }) => {
  const label = parseInt(value, 10) === 1 ? 'Space' : 'Spaces';

  return (
    <div className="zone-input-wrapper">
      <div className="zone-input-label">Zone</div>
      <div className="zone-input-container">
        <input
          type="number"
          className="zone-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="-"
        />
        <span className="zone-label">{label}</span>
      </div>
    </div>
  );
};

export default ZoneInput;
