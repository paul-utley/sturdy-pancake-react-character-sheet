import React from 'react';
import './FloatingHeader.css';

const FloatingHeader = ({ title, onDecrement, onIncrement }) => {
  // Render controls only if handlers are provided
  const showControls = onDecrement && onIncrement;

  return (
    <div className="floating-header">
      {showControls && <div className="header-control left" onClick={onDecrement}>-</div>}
      <span className="header-title">{title}</span>
      {showControls && <div className="header-control right" onClick={onIncrement}>+</div>}
    </div>
  );
};

export default FloatingHeader;
