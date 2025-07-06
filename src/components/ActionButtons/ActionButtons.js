import React from 'react';
import './ActionButtons.css';

const ActionButtons = ({ onOpenCharactersModal }) => {
  return (
    <div className="action-buttons-container">
        <button className="action-btn" onClick={onOpenCharactersModal}>Characters</button>
    </div>
  );
};

export default ActionButtons;
