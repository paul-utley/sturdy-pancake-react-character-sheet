import React from 'react';
import './ActionButtons.css';

const ActionButtons = ({ onReset, onExport }) => {
  return (
    <div className="action-buttons-container">
        <button className="action-btn" onClick={onExport}>Character Data</button>
        <button className="action-btn" onClick={onReset}>New Character</button>
    </div>
  );
};

export default ActionButtons;
