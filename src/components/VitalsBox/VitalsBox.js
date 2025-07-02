import React from 'react';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import './VitalsBox.css';

const VitalsBox = ({ name, value, max, onChange, canExceedMax = false, isHighlighted = false }) => {

    const increment = () => {
    if (canExceedMax || max === '' || value < parseInt(max, 10)) {
      onChange({ name, value: value + 1, max });
    }
  };

  const decrement = () => {
    if (value > 0) {
      onChange({ name, value: value - 1, max });
    }
  };

  const handleMaxChange = (e) => {
    onChange({ name, value, max: e.target.value });
  };

  return (
    <div className="vitals-box">
      <FloatingHeader 
        title={name} 
        onIncrement={increment} 
        onDecrement={decrement} 
      />
      <div className="vitals-value-wrapper">
              <div className={`vitals-fraction ${isHighlighted ? 'highlight-flash' : ''}`}>
          <input type="text" className="vitals-value" value={value} readOnly />
          <input
            type="text"
            className="vitals-max-input"
            placeholder="Max"
            value={max}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VitalsBox;
