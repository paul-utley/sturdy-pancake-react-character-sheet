import { useState, useRef } from 'react';

export default function useRoundActions({ setCharacter, clearAbilityButtons }) {
  const [highlightedFields, setHighlightedFields] = useState([]);
  const highlightTimerRef = useRef(null);

  const startHighlight = (fields) => {
    clearTimeout(highlightTimerRef.current);
    setHighlightedFields(fields);
    highlightTimerRef.current = setTimeout(() => setHighlightedFields([]), 1500);
  };

  const handleNewRound = () => {
    clearAbilityButtons();
    setCharacter(prev => {
      const dashesMax = parseInt(prev.dashes.max, 10);
      const newDashes = { ...prev.dashes };
      if (!isNaN(dashesMax)) newDashes.value = dashesMax;

      const newAttributes = prev.attributes.map(attr => {
        if (attr.name === 'Resolve') {
          const resolveMax = parseInt(attr.max, 10);
          if (!isNaN(resolveMax)) return { ...attr, value: resolveMax };
        }
        return attr;
      });

      return { ...prev, dashes: newDashes, attributes: newAttributes };
    });
    startHighlight(['Resolve', 'Dashes']);
  };

  const handleQuickRest = () => {
    clearAbilityButtons();
    setCharacter(prev => {
      const dashesMax = parseInt(prev.dashes.max, 10);
      const newDashes = { ...prev.dashes };
      if (!isNaN(dashesMax)) newDashes.value = dashesMax;

      const vigorMax = parseInt(prev.vigor.max, 10);
      const newVigor = { ...prev.vigor };
      if (!isNaN(vigorMax)) newVigor.value = vigorMax;

      const newAttributes = prev.attributes.map(attr => {
        if (attr.name === 'Resolve') {
          const resolveMax = parseInt(attr.max, 10);
          if (!isNaN(resolveMax)) return { ...attr, value: resolveMax };
        }
        return attr;
      });

      return { ...prev, dashes: newDashes, vigor: newVigor, attributes: newAttributes };
    });
    startHighlight(['Vigor', 'Resolve', 'Dashes']);
  };

  const handleLongRest = () => {
    clearAbilityButtons();
    const fieldsToHighlight = [];

    setCharacter(prev => {
      const vitalsToReset = ['health', 'vigor', 'dashes'];
      const newVitals = {};
      vitalsToReset.forEach(key => {
        const vital = prev[key];
        const max = parseInt(vital.max, 10);
        newVitals[key] = { ...vital };
        if (!isNaN(max)) {
          newVitals[key].value = max;
          fieldsToHighlight.push(vital.name);
        }
      });

      const newAttributes = prev.attributes.map(attr => {
        const max = parseInt(attr.max, 10);
        if (!isNaN(max)) {
          fieldsToHighlight.push(attr.name);
          return { ...attr, value: max };
        }
        return attr;
      });

      return { ...prev, ...newVitals, attributes: newAttributes, momentum: false };
    });

    startHighlight(fieldsToHighlight);
  };

  return { highlightedFields, setHighlightedFields, handleNewRound, handleQuickRest, handleLongRest };
}
