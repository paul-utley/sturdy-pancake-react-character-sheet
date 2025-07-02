import React from 'react';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import './AttributeBox.css';

const AttributeBox = ({ name, value, max, onChange, canExceedMax = false, isHighlighted = false }) => {

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
    const newMax = e.target.value;
    const newMaxValue = parseInt(newMax, 10);
    const newValue = !isNaN(newMaxValue) ? newMaxValue : value;
    onChange({ name, value: newValue, max: newMax });
  };

  return (
    <div className="attribute-box">
      <FloatingHeader 
        title={name} 
        onIncrement={increment} 
        onDecrement={decrement} 
      />
      <div className="attribute-value-wrapper">
              <div className={`attribute-fraction ${isHighlighted ? 'highlight-flash' : ''}`}>
          <input type="text" className="attribute-value" value={value} readOnly />
          <span className="attribute-separator">/</span>
          <input
            type="text"
            className="attribute-max-input"
            placeholder="Max"
            value={max}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AttributeBox;
