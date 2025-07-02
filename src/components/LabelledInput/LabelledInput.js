import React from 'react';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import './LabelledInput.css';

const LabelledInput = ({ label, value, onChange, type = 'text', placeholder = '' }) => {
  return (
    <div className="labelled-input-container">
      <FloatingHeader title={label} />
      <input
        type={type}
        className="labelled-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default LabelledInput;
