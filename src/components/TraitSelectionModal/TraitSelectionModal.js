import React from 'react';
import ReactDOM from 'react-dom';
import './TraitSelectionModal.css';

const TraitSelectionModal = ({ isOpen, onClose, traitOptions, onSelect }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select a Trait</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <ul className="trait-list">
            {traitOptions.map((trait) => (
              <li key={trait.label} className="trait-item" onClick={() => onSelect(trait)}>
                <div className="trait-label">{trait.label} <span className="trait-cost">{`{${trait.cost} TP}`}</span></div>
                <div className="trait-text">{trait.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TraitSelectionModal;
