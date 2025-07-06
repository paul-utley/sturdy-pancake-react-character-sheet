import React, { useState, useEffect } from 'react';
import './DataModal.css';

const DataModal = ({ characterData, onClose }) => {
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    // This ensures the textarea is updated if the characterData prop changes.
    setJsonInput(JSON.stringify(characterData, null, 2));
  }, [characterData]);

  if (!characterData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Character Data</h2>
        <textarea
          className="json-display"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default DataModal;
