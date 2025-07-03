import React from 'react';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import './NumericInputBox.css';

const NumericInputBox = ({ name, value, onChange }) => {

  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
        onChange(newValue);
    }
  };

  return (
    <div className="numeric-input-box">
      <FloatingHeader 
        title={name} 
        onIncrement={increment} 
        onDecrement={decrement} 
      />
      <div className="numeric-value-wrapper">
        <input 
            type="text" 
            className="numeric-value" 
            value={value} 
            onChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default NumericInputBox;
