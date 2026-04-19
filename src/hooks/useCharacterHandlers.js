import { useCallback } from 'react';
import { newTechniqueTemplate } from './useCharacterStore';

export default function useCharacterHandlers({ character, setCharacter }) {
  const handleFieldChange = useCallback((fieldName, value) => {
    setCharacter(prev => ({ ...prev, [fieldName]: value }));
  }, [setCharacter]);

  const handleAttributeChange = useCallback((index, newAttribute) => {
    setCharacter(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => i === index ? newAttribute : attr),
    }));
  }, [setCharacter]);

  const handleAbilitiesChange = useCallback((newAbilities) => {
    setCharacter(prev => ({ ...prev, abilities: newAbilities }));
  }, [setCharacter]);

  const handleAddAbility = useCallback(() => {
    setCharacter(prev => ({
      ...prev,
      abilities: [...prev.abilities, { id: Date.now(), label: '', text: '' }],
    }));
  }, [setCharacter]);

  const handleSkillChange = useCallback((index, updatedSkill) => {
    setCharacter(prev => {
      const newSkills = [...prev.skills];
      const currentSkill = newSkills[index];
      if (updatedSkill.level !== undefined && updatedSkill.level === currentSkill.level) {
        updatedSkill.level -= 1;
      }
      newSkills[index] = { ...currentSkill, ...updatedSkill };
      return { ...prev, skills: newSkills };
    });
  }, [setCharacter]);

  const handleHealthChange = useCallback((newHealth) => {
    const steadfastMax = Number(character.attributes.find(a => a.name === 'Steadfast')?.max || 0);
    const minHealthMax = 5 + steadfastMax;
    if (newHealth.max !== '' && Number(newHealth.max) < minHealthMax) {
      newHealth.max = String(minHealthMax);
    }
    setCharacter(prev => ({ ...prev, health: newHealth }));
  }, [character, setCharacter]);

  const handleVigorChange = useCallback((newVigor) => {
    const daringMax = Number(character.attributes.find(a => a.name === 'Daring')?.max || 0);
    const minVigorMax = 3 + daringMax;
    if (newVigor.max !== '' && Number(newVigor.max) < minVigorMax) {
      newVigor.max = String(minVigorMax);
    }
    setCharacter(prev => ({ ...prev, vigor: newVigor }));
  }, [character, setCharacter]);

  const handleDashesChange = useCallback((newDashes) => {
    setCharacter(prev => ({ ...prev, dashes: newDashes }));
  }, [setCharacter]);

  const handleDRChange = useCallback((newValue) => {
    setCharacter(prev => ({ ...prev, damageReduction: newValue }));
  }, [setCharacter]);

  const handleArmorChange = useCallback((newArmor) => {
    let newDR = 0;
    let newMaxDashes = 6;
    if (newArmor === 'Light' || newArmor === 'Medium') newMaxDashes = 5;
    else if (newArmor === 'Heavy') newMaxDashes = 4;
    if (newArmor === 'Medium') newDR = 1;
    else if (newArmor === 'Heavy') newDR = 2;

    setCharacter(prev => ({
      ...prev,
      armor: newArmor,
      damageReduction: newDR,
      dashes: { ...prev.dashes, max: String(newMaxDashes), value: newMaxDashes },
    }));
  }, [setCharacter]);

  const handleAddTechnique = useCallback((columnIndex) => {
    setCharacter(prev => ({
      ...prev,
      combatTechniques: [
        ...prev.combatTechniques,
        { id: Date.now(), column: columnIndex, ...newTechniqueTemplate },
      ],
    }));
  }, [setCharacter]);

  const handleTechniqueChange = useCallback((id, updatedTechnique) => {
    setCharacter(prev => ({
      ...prev,
      combatTechniques: prev.combatTechniques.map(t => t.id === id ? updatedTechnique : t),
    }));
  }, [setCharacter]);

  const handleRemoveTechnique = useCallback((id) => {
    setCharacter(prev => ({
      ...prev,
      combatTechniques: prev.combatTechniques.filter(t => t.id !== id),
    }));
  }, [setCharacter]);

  return {
    handleFieldChange,
    handleAttributeChange,
    handleAbilitiesChange,
    handleAddAbility,
    handleSkillChange,
    handleHealthChange,
    handleVigorChange,
    handleDashesChange,
    handleDRChange,
    handleArmorChange,
    handleAddTechnique,
    handleTechniqueChange,
    handleRemoveTechnique,
  };
}
