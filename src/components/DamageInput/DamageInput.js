import React from 'react';
import './DamageInput.css';

const DamageInput = ({ d6, d4, onChange }) => {
  const handleD6Change = (e) => {
    onChange({ d6: e.target.value, d4 });
  };

  const handleD4Change = (e) => {
    onChange({ d6, d4: e.target.value });
  };

  return (
    <div className="damage-input-wrapper">
      <div className="damage-input-label">Damage</div>
      <div className="damage-input-container">
        <input
          type="number"
          className="damage-die-input"
          value={d6}
          onChange={handleD6Change}
          placeholder="-"
        />
        <span className="damage-label">d6 +</span>
        <input
          type="number"
          className="damage-die-input"
          value={d4}
          onChange={handleD4Change}
          placeholder="-"
        />
        <span className="damage-label">d4</span>
      </div>
    </div>
  );
};

export default DamageInput;
