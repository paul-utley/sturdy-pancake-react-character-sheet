import { useState, useEffect } from 'react';
import pako from 'pako';

// Helper function to merge loaded state with initial state, ensuring new fields are added.
function mergeWithInitial(initialValue, loadedState) {
  if (typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)) {
    const mergedState = { ...initialValue, ...loadedState };

        // Special handling for the 'skills' array to preserve skill levels
    // and the custom name of the editable skill.
    if (Array.isArray(initialValue.skills) && Array.isArray(loadedState.skills)) {
      const skillLevels = new Map();
      loadedState.skills.forEach(skill => {
        skillLevels.set(skill.name, skill.level);
      });

      // Find the user's custom-named skill, if it exists.
      const loadedEditableSkill = loadedState.skills.find(s => s.isEditable);

      mergedState.skills = initialValue.skills.map(defaultSkill => {
        // If this is the slot for the editable skill, use the loaded one.
        if (defaultSkill.isEditable && loadedEditableSkill) {
          return loadedEditableSkill;
        }
        
        // For standard skills, preserve their level.
        return {
          ...defaultSkill,
          level: skillLevels.get(defaultSkill.name) || 0,
        };
      });
    }
    return mergedState;
  }
  return loadedState;
}

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const characterDataFromURL = urlParams.get('character');

      if (characterDataFromURL) {
        let parsedState = null;

        // Attempt 1: Try to parse as new, compressed format
        try {
          const binaryString = atob(characterDataFromURL);
          const uint8array = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
          const jsonString = pako.inflate(uint8array, { to: 'string' });
          parsedState = JSON.parse(jsonString);
        } catch (e) {
          // This can fail if the data is not compressed; we'll try the old format next.
        }

        // Attempt 2: If first attempt failed, try old, uncompressed format
        if (!parsedState) {
          try {
            const jsonString = atob(characterDataFromURL);
            parsedState = JSON.parse(jsonString);
          } catch (e) {
            console.error("Could not parse data from URL. It may be corrupt.", e);
          }
        }
        
        // If we successfully parsed state from either format, use it.
        if (parsedState) {
          return mergeWithInitial(initialValue, parsedState);
        }
      }

      // Fallback to localStorage if URL processing fails or isn't present
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        return mergeWithInitial(initialValue, JSON.parse(storedValue));
      }

      return initialValue;
    } catch (error) {
      console.error('Error initializing persistent state', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Save state to localStorage
      window.localStorage.setItem(key, JSON.stringify(state));

      // Also save state to URL query parameter (compressed)
      const jsonString = JSON.stringify(state);
      const compressed = pako.deflate(jsonString); // Uint8Array
      
      // Safely convert Uint8Array to a binary string for btoa
      let binaryString = '';
      compressed.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
      });
      const serializedState = btoa(binaryString);

      const url = new URL(window.location);
      url.searchParams.set('character', serializedState);
      window.history.replaceState({ path: url.href }, '', url.href);
    } catch (error) {
      console.error('Error persisting state', error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
