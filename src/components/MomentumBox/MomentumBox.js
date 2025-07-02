import React from 'react';
import './MomentumBox.css';

const MomentumBox = ({ isActive, onClick }) => {
  return (
    <div
      className={`momentum-box ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
    >
      <span>Momentum</span>
    </div>
  );
};

export default MomentumBox;
