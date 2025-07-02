import React, { useState, useEffect } from 'react';
import './ExportModal.css';

const ExportModal = ({ characterData, onClose, onUpdate }) => {
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    // This ensures the textarea is updated if the characterData prop changes.
    setJsonInput(JSON.stringify(characterData, null, 2));
  }, [characterData]);

  if (!characterData) {
    return null;
  }

  const handleUpdateClick = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      onUpdate(parsedData);
      onClose(); // Close modal on successful update
    } catch (error) {
      alert('Invalid JSON format. Please correct the data and try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Character Data</h2>
        <textarea
          className="json-display"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button className="modal-update-btn" onClick={handleUpdateClick}>Update Character</button>
      </div>
    </div>
  );
};

export default ExportModal;
