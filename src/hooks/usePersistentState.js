import { useState, useEffect } from 'react';
import pako from 'pako';

// // Helper function to merge loaded state with initial state, ensuring new fields are added.
// function mergeWithInitial(initialValue, loadedState) {
//   if (typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)) {
//     const mergedState = { ...initialValue, ...loadedState };

//         // Special handling for the 'skills' array to preserve skill levels
//     // and the custom name of the editable skill.
//     if (Array.isArray(initialValue.skills) && Array.isArray(loadedState.skills)) {
//       const skillLevels = new Map();
//       loadedState.skills.forEach(skill => {
//         skillLevels.set(skill.name, skill.level);
//       });

//       // Find the user's custom-named skill, if it exists.
//       const loadedEditableSkill = loadedState.skills.find(s => s.isEditable);

//       mergedState.skills = initialValue.skills.map(defaultSkill => {
//         // If this is the slot for the editable skill, use the loaded one.
//         if (defaultSkill.isEditable && loadedEditableSkill) {
//           return loadedEditableSkill;
//         }
        
//         // For standard skills, preserve their level.
//         return {
//           ...defaultSkill,
//           level: skillLevels.get(defaultSkill.name) || 0,
//         };
//       });
//     }
//     return mergedState;
//   }
//   return loadedState;
// }

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {

      const storedValue = window.localStorage.getItem(key);

      if(key === 'characters') {
        let characters = JSON.parse(storedValue) || initialValue;
        const urlParams = new URLSearchParams(window.location.search);
        const characterDataFromURL = urlParams.get('character');

        if (characterDataFromURL) {
          let parsedCharacter = null;

        // Attempt 1: Try to parse as new, compressed format
        try {
          const binaryString = atob(characterDataFromURL);
          const uint8array = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
          const jsonString = pako.inflate(uint8array, { to: 'string' });
          parsedCharacter = JSON.parse(jsonString);
        } catch (e) {
          // This can fail if the data is not compressed; we'll try the old format next.
          console.error("Could not parse compressed character data from URL. It may be corrupt.", e);
          //Alert the user
          alert("Could not parse character data from URL. It may be corrupt.");
        }

        if (parsedCharacter) {
          //Add the parsed character to the characters object using the id field
          characters[parsedCharacter.id] = parsedCharacter;
          //setActiveCharacterId(parsedCharacter.id);
        }
      }
      return characters;
    }

      // Fallback to localStorage if URL processing fails or isn't present

      return storedValue;
    } catch (error) {
      console.error('Error initializing persistent state', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Save state to localStorage
      if(key  === 'characters') {
        window.localStorage.setItem(key, JSON.stringify(state));
      }else if(key === 'activeCharacterId') {
        window.localStorage.setItem(key, state);
      }
      // URL parameter logic is now handled in App.js to ensure
      // the active character's data is used.
    } catch (error) {
      console.error('Error persisting state', error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
