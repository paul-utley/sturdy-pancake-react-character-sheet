import React, { useState } from 'react';
import './ImportCharacterModal.css';

const ImportCharacterModal = ({ isOpen, onClose, onImport }) => {
  const [pastedData, setPastedData] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleImportClick = () => {
    if (pastedData.trim()) {
      onImport(pastedData);
    } else {
      alert('Please paste character data into the text area.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content import-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import Character</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Paste your character data below to import.</p>
          <textarea
            className="import-textarea"
            value={pastedData}
            onChange={(e) => setPastedData(e.target.value)}
            placeholder="Paste character data here..."
          />
        </div>
        <div className="modal-footer">
          <button className="footer-btn import-btn" onClick={handleImportClick}>Import Character</button>
        </div>
      </div>
    </div>
  );
};

export default ImportCharacterModal;
