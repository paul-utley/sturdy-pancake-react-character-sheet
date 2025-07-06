import React from 'react';
import './CombatTechniqueAttributeInput.css';

const CombatTechniqueAttributeInput = ({ label, value, onChange, options, units }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const selectedOption = options.find(option => option.key === value);
  const cost = selectedOption ? selectedOption.value : null;

  return (
    <div className="attribute-input-wrapper">
      <div className="attribute-input-label">
        {label}
        {cost !== null && <span className="attribute-cost-display">{`{${cost} TP}`}</span>}
      </div>
      <div className="attribute-input-container">
        <select className="attribute-select" value={value} onChange={handleChange}>
          <option value="" disabled>Select {label}</option>
          {options.map(option => (
            <option key={option.key} value={option.key}>
              {`${option.key}`}
            </option>
          ))}
        </select>
        <span className="attribute-units">{units}</span>
      </div>
    </div>
  );
};

export default CombatTechniqueAttributeInput;
