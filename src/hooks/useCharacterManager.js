import pako from 'pako';
import { createNewCharacter } from './useCharacterStore';

export default function useCharacterManager({
  characters,
  setCharacters,
  activeCharacterId,
  setActiveCharacterId,
  setCharacterModalOpen,
  setImportModalOpen,
  clearHighlights,
  clearAbilityButtons,
}) {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to create a new character?')) {
      const newChar = createNewCharacter();
      setCharacters(prev => ({ ...prev, [newChar.id]: newChar }));
      setActiveCharacterId(newChar.id);
      clearHighlights();
      clearAbilityButtons();
    }
  };

  const handleLoadCharacter = (characterId) => {
    setActiveCharacterId(characterId);
    setCharacterModalOpen(false);
  };

  const handleDeleteCharacter = (characterId) => {
    if (Object.keys(characters).length <= 1) {
      alert('You cannot delete the last character.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this character? This cannot be undone.')) {
      const newChars = { ...characters };
      delete newChars[characterId];
      if (characterId === activeCharacterId) {
        setActiveCharacterId(Object.keys(newChars)[0]);
      }
      setCharacters(newChars);
    }
  };

  const handleImportCharacter = (data) => {
    let parsedCharacter = null;
    try {
      try {
        const binaryString = atob(data);
        const uint8array = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
        parsedCharacter = JSON.parse(pako.inflate(uint8array, { to: 'string' }));
      } catch (e) {
        // Not compressed — fall through to plain JSON attempt
      }

      if (!parsedCharacter) parsedCharacter = JSON.parse(data);
      if (!parsedCharacter.id) parsedCharacter.id = Date.now();

      if (parsedCharacter?.id) {
        const newId = characters[parsedCharacter.id] ? Date.now() : parsedCharacter.id;
        const newCharacter = { ...parsedCharacter, id: newId };
        setCharacters(prev => ({ ...prev, [newId]: newCharacter }));
        setActiveCharacterId(newId);
        setImportModalOpen(false);
        alert(`Character "${newCharacter.characterName || 'Unnamed Character'}" imported successfully!`);
      } else {
        throw new Error('Invalid or missing character data/ID.');
      }
    } catch (error) {
      console.error('Failed to import character:', error);
      alert('Could not import character. The data may be corrupt or in an invalid format.');
    }
  };

  return { handleReset, handleLoadCharacter, handleDeleteCharacter, handleImportCharacter };
}
