import React from 'react';
import './ActionButtons.css';

const ActionButtons = ({ onReset, onNewRound, onLongRest, onExport }) => {
  return (
    <div className="action-buttons-container">
      <div className="action-buttons-left">
        <button className="action-btn" onClick={onExport}>Character Data</button>
        <button className="action-btn" onClick={onReset}>New Character</button>
      </div>
      <div className="action-buttons-right">
        <button className="action-btn" onClick={onNewRound}>New Round</button>
        <button className="action-btn" onClick={onLongRest}>Long Rest</button>
      </div>
    </div>
  );
};

export default ActionButtons;
