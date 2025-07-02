import React from 'react';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import './LabelledSelect.css';

const LabelledSelect = ({ label, options, value, onChange }) => {
  return (
    <div className="labelled-select-container">
      <FloatingHeader title={label} />
      <select className="labelled-select" value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LabelledSelect;
