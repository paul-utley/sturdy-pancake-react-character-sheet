import React from 'react';
import './LoadCharacterModal.css';

const CharacterModal = ({ isOpen, canClose = true, onClose, characters, onLoad, onDelete, onNewCharacter, onOpenDataModal, onImport }) => {
  const handleDownload = (character) => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `${character.characterName || 'Unnamed Character'}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  if (!isOpen) return null;

  const characterList = Object.values(characters);

  const handleOverlayClick = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Characters</h2>
          {canClose && <button className="close-btn" onClick={onClose}>×</button>}
        </div>
        <div className="modal-body">
          {characterList.length === 0 ? (
            <p>No saved characters found.</p>
          ) : (
            <ul className="character-list">
              {characterList.map((char) => (
                <li key={char.id} className="character-item" onClick={() => onLoad(char.id)}>
                  <span className="character-name">{char.characterName || 'Unnamed Character'}</span>
                  <div className="character-actions">
                    <button onClick={(e) => { e.stopPropagation(); onOpenDataModal(char.id); }} className="char-btn export-btn" title="Edit Raw Data"><img src="data.png" alt="View Raw Data" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(char); }} className="char-btn download-btn" title="Download Character"><img src="download.png" alt="Download Character" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(char.id); }} className="char-btn delete-btn" title="Delete Character"><img src="delete.png" alt="Delete Character" /></button>
                    
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className='char-modal-actions'>
            <button onClick={onImport} className="new-char-btn" title="Import Character"><img src='import.png' alt="Import Character" /></button>
            <button onClick={onNewCharacter} className="new-char-btn" title="New Character"><img src='add.png' alt="New Character" /></button>
          </div>
        </div>
        <div className="modal-footer">
          <div className="footer-actions">
          </div>
          <p className="storage-warning">
            <strong>Warning:</strong> All character data is stored in your browser's local storage. Clearing your browser data may result in the permanent loss of your characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
