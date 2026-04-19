import { useEffect, useCallback } from 'react';
import pako from 'pako';
import usePersistentState from './usePersistentState';

export const initialCharacterState = {
  characterName: '',
  archetype: '',
  archetypeBody: '',
  bio: { id: 'bio', label: 'Bio', text: '' },
  beliefs: { id: 'beliefs', label: 'Beliefs', text: '' },
  goals: { id: 'goals', label: 'Goals', text: '' },
  attributes: [
    { name: 'Daring', value: 0, max: '' },
    { name: 'Deft', value: 0, max: '' },
    { name: 'Steadfast', value: 0, max: '' },
    { name: 'Shrouded', value: 0, max: '' },
    { name: 'Resolve', value: 2, max: '2' },
  ],
  abilities: [{ id: 1, label: '', text: '' }],
  skills: [
    { name: 'Athletics', level: 0 },
    { name: 'Convince', level: 0 },
    { name: 'Covert', level: 0 },
    { name: 'Finesse', level: 0 },
    { name: 'Insight', level: 0 },
    { name: 'Intimidate', level: 0 },
    { name: 'Medicine', level: 0 },
    { name: 'Misdirection', level: 0 },
    { name: 'Perception', level: 0 },
    { name: 'Research', level: 0 },
    { name: 'Survival', level: 0 },
    { name: 'Other', level: 0, isEditable: true },
  ],
  health: { name: 'Health', value: 0, max: '' },
  vigor: { name: 'Vigor', value: 0, max: '' },
  dashes: { name: 'Dashes', value: 0, max: '6' },
  armor: '',
  damageReduction: 0,
  inventory: [''],
  combatTechniques: [{ id: 1, column: 0, title: '', body: '', damage: '', zone: '', armament: '', role: '', range: '', traits: [{ id: 1, label: '', text: '' }], totalCost: 0 }],
  momentum: false,
};

export const newTechniqueTemplate = {
  title: '',
  body: '',
  damage: '',
  zone: '',
  armament: '',
  role: '',
  range: '',
  traits: [{ id: 1, label: '', text: '' }],
  totalCost: 0,
};

export const createNewCharacter = () => ({
  ...initialCharacterState,
  id: Date.now(),
  abilities: [{ id: Date.now(), label: '', text: '' }],
  combatTechniques: [{ ...newTechniqueTemplate, id: Date.now(), column: 0, traits: [{ id: Date.now(), label: '', text: '' }] }],
});

export default function useCharacterStore() {
  const [characters, setCharacters] = usePersistentState('characters', {});
  const [activeCharacterId, setActiveCharacterId] = usePersistentState('activeCharacterId', null);

  useEffect(() => {
    if (Object.keys(characters).length === 0) {
      const newChar = createNewCharacter();
      setCharacters({ [newChar.id]: newChar });
      setActiveCharacterId(newChar.id);
    } else if (!activeCharacterId || !characters[activeCharacterId]) {
      setActiveCharacterId(Object.keys(characters)[0]);
    }
  }, [characters, activeCharacterId, setCharacters, setActiveCharacterId]);

  const character = activeCharacterId ? characters[activeCharacterId] : null;

  const setCharacter = useCallback((updater) => {
    if (!activeCharacterId) return;
    setCharacters(prevChars => {
      const oldChar = prevChars[activeCharacterId];
      const newChar = typeof updater === 'function' ? updater(oldChar) : updater;
      return { ...prevChars, [activeCharacterId]: { ...newChar, id: activeCharacterId } };
    });
  }, [activeCharacterId, setCharacters]);

  // Data migration: damageReduction from object shape to number
  useEffect(() => {
    if (!character) return;
    if (typeof character.damageReduction === 'object' && character.damageReduction !== null) {
      setCharacter(prev => ({ ...prev, damageReduction: character.damageReduction.value || 0 }));
    }
  }, [character, setCharacter]);

  // Enforce vigor minimum based on Daring max
  useEffect(() => {
    if (!character) return;
    const daringMax = Number(character.attributes.find(a => a.name === 'Daring')?.max || 0);
    const minVigorMax = 3 + daringMax;
    if (Number(character.vigor.max || 0) < minVigorMax) {
      setCharacter(prev => ({ ...prev, vigor: { ...prev.vigor, max: String(minVigorMax) } }));
    }
  }, [character, setCharacter]);

  // Enforce health minimum based on Steadfast max + sync character to URL
  useEffect(() => {
    if (!character) return;
    const steadfastMax = Number(character.attributes.find(a => a.name === 'Steadfast')?.max || 0);
    const minHealthMax = 5 + steadfastMax;
    if (Number(character.health.max || 0) < minHealthMax) {
      setCharacter(prev => ({ ...prev, health: { ...prev.health, max: String(minHealthMax) } }));
    }

    try {
      const compressed = pako.deflate(JSON.stringify(character));
      let binaryString = '';
      compressed.forEach(byte => { binaryString += String.fromCharCode(byte); });
      const url = new URL(window.location);
      url.searchParams.set('character', btoa(binaryString));
      window.history.replaceState({ path: url.href }, '', url.href);
    } catch (error) {
      console.error('Error updating URL with character data:', error);
    }
  }, [character, setCharacter]);

  return { characters, setCharacters, character, setCharacter, activeCharacterId, setActiveCharacterId };
}
