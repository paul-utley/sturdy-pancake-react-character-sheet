import React, { useState, useEffect, useCallback } from 'react';
import useMediaQuery from './hooks/useMediaQuery';
import usePersistentState from './hooks/usePersistentState';
import pako from 'pako';
import './App.css';
import AttributeBox from './components/AttributeBox/AttributeBox';
import VitalsBox from './components/VitalsBox/VitalsBox';
import DynamicList from './components/DynamicList/DynamicList';
import SectionBox from './components/SectionBox/SectionBox';
import TabbedTextarea from './components/TabbedTextarea/TabbedTextarea';
import DynamicListItem from './components/DynamicListItem/DynamicListItem';
import AutosizeTextarea from './components/AutosizeTextarea/AutosizeTextarea';
import FloatingHeader from './components/FloatingHeader/FloatingHeader';
import SkillItem from './components/SkillItem/SkillItem';
import ExpandingList from './components/ExpandingList/ExpandingList';
import CombatTechniqueBox from './components/CombatTechniqueBox/CombatTechniqueBox';
import ActionButtons from './components/ActionButtons/ActionButtons';
import MomentumBox from './components/MomentumBox/MomentumBox';
import DataModal from './components/DataModal/DataModal';
import PaymentChoiceModal from './components/PaymentChoiceModal/PaymentChoiceModal';
import NumericInputBox from './components/NumericInputBox/NumericInputBox';
import CharacterModal from './components/LoadCharacterModal/LoadCharacterModal';
import ImportCharacterModal from './components/ImportCharacterModal/ImportCharacterModal';

const initialCharacterState = {
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
    { name: 'Other', level: 0, isEditable: true }
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

const createNewCharacter = () => ({
  ...initialCharacterState,
  id: Date.now(),
  abilities: [{ id: Date.now(), label: '', text: '' }],
  combatTechniques: [{ ...newTechniqueTemplate, id: Date.now(), column: 0, traits: [{ id: Date.now(), label: '', text: '' }] }]
});

const newTechniqueTemplate = {
  title: '', 
  body: '', 
  damage: '', 
  zone: '', 
  armament: '', 
  role: '', 
  range: '',
  traits: [{ id: 1, label: '', text: '' }],
  totalCost: 0
};

function App() {
  const [characters, setCharacters] = usePersistentState('characters', {});
  const [activeCharacterId, setActiveCharacterId] = usePersistentState('activeCharacterId', null);
  const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);

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

  const [highlightedFields, setHighlightedFields] = useState([]);
  const [isDataModalOpen, setDataModalOpen] = useState(false); 
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const isMediumScreen = useMediaQuery('(max-width: 1299px)');
  const [inactiveAbilityButtons, setInactiveAbilityButtons] = useState([]);
  const [paymentModalAbility, setPaymentModalAbility] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!character) return;
    if (typeof character.damageReduction === 'object' && character.damageReduction !== null) {
      setCharacter(prev => ({
        ...prev,
        damageReduction: character.damageReduction.value || 0
      }));
    }
  }, [character, setCharacter]);

  useEffect(() => {
    if (!character) return;
    const daringAttribute = character.attributes.find(attr => attr.name === 'Daring');
    const daringMax = Number(daringAttribute?.max || 0);
    const minVigorMax = 3 + daringMax;
    const currentVigorMax = Number(character.vigor.max || 0);

    if (currentVigorMax < minVigorMax) {
      setCharacter(prev => ({
        ...prev,
        vigor: { ...prev.vigor, max: String(minVigorMax) }
      }));
    }
  }, [character, setCharacter]);

  useEffect(() => {
    if (!character) return;
    const steadfastAttribute = character.attributes.find(attr => attr.name === 'Steadfast');
    const steadfastMax = Number(steadfastAttribute?.max || 0);
    const minHealthMax = 5 + steadfastMax;
    const currentHealthMax = Number(character.health.max || 0);

    if (currentHealthMax < minHealthMax) {
      setCharacter(prev => ({
        ...prev,
        health: { ...prev.health, max: String(minHealthMax) }
      }));
    }

    try {
      const jsonString = JSON.stringify(character);
      const compressed = pako.deflate(jsonString);
      
      let binaryString = '';
      compressed.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
      });
      const serializedState = btoa(binaryString);

      const url = new URL(window.location);
      url.searchParams.set('character', serializedState);
      window.history.replaceState({ path: url.href }, '', url.href);
    } catch (error) {
      console.error('Error updating URL with character data:', error);
    }
  }, [character, setCharacter]);

    const handleReset = () => {
    if (window.confirm('Are you sure you want to create a new character?')) {
      const newChar = createNewCharacter();
      setCharacters(prev => ({ ...prev, [newChar.id]: newChar }));
      setActiveCharacterId(newChar.id);
      setHighlightedFields([]);
      setInactiveAbilityButtons([]);
    }
  };

  const handleLoadCharacter = (characterId) => {
    setActiveCharacterId(characterId);
    setCharacterModalOpen(false);
    
  };

  const handleDeleteCharacter = (characterId) => {
    if (Object.keys(characters).length <= 1) {
      alert("You cannot delete the last character.");
      return;
    }

    if (window.confirm('Are you sure you want to delete this character? This cannot be undone.')) {
      const newChars = { ...characters };
      delete newChars[characterId];
      
      if (characterId === activeCharacterId) {
        const newActiveId = Object.keys(newChars)[0];
        setActiveCharacterId(newActiveId);
      }
      setCharacters(newChars);
    }
  };

  const handleNewRound = () => {
    setInactiveAbilityButtons([]);
    setCharacter(prev => {
      const dashesMax = parseInt(prev.dashes.max, 10);
      const newDashes = { ...prev.dashes };
      if (!isNaN(dashesMax)) {
        newDashes.value = dashesMax;
      }

      const newAttributes = prev.attributes.map(attr => {
        if (attr.name === 'Resolve') {
          const resolveMax = parseInt(attr.max, 10);
          if (!isNaN(resolveMax)) {
            return { ...attr, value: resolveMax };
          }
        }
        return attr;
      });

      return {
        ...prev,
        dashes: newDashes,
        attributes: newAttributes,
      };
    });

    setHighlightedFields(['Resolve', 'Dashes']);
    setTimeout(() => {
      setHighlightedFields([]);
    }, 1500); // Match animation duration
  };

  const handleQuickRest = () => {
    setInactiveAbilityButtons([]);
    setCharacter(prev => {
      const dashesMax = parseInt(prev.dashes.max, 10);
      const newDashes = { ...prev.dashes };
      if (!isNaN(dashesMax)) {
        newDashes.value = dashesMax;
      }

      const vigorMax = parseInt(prev.vigor.max, 10);
      const newVigor = { ...prev.vigor };
      if (!isNaN(vigorMax)) {
        newVigor.value = vigorMax;
      }

      const newAttributes = prev.attributes.map(attr => {
        if (attr.name === 'Resolve') {
          const resolveMax = parseInt(attr.max, 10);
          if (!isNaN(resolveMax)) {
            return { ...attr, value: resolveMax };
          }
        }
        return attr;
      });

      return {
        ...prev,
        dashes: newDashes,
        vigor: newVigor,
        attributes: newAttributes,
      };
    });

    setHighlightedFields(['Vigor', 'Resolve', 'Dashes']);
    setTimeout(() => {
      setHighlightedFields([]);
    }, 1500);
  };

  const handleImport = () => {
    setImportModalOpen(true);
  };

  const handleImportCharacter = (data) => {
    let parsedCharacter = null;
    try {
        // Attempt 1: Try to parse as new, compressed format
        try {
            const binaryString = atob(data);
            const uint8array = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
            const jsonString = pako.inflate(uint8array, { to: 'string' });
            parsedCharacter = JSON.parse(jsonString);
        } catch (e) {
            // This can fail if the data is not compressed; we'll try plain JSON next.
        }

        // Attempt 2: If first attempt failed, try plain JSON
        if (!parsedCharacter) {
            parsedCharacter = JSON.parse(data);
        }

        // If the imported character has no ID, generate one
        if (!parsedCharacter.id) {
            parsedCharacter.id = Date.now();
        }

        if (parsedCharacter && parsedCharacter.id) {
            // Ensure the imported character doesn't overwrite an existing one
            // by giving it a new ID if a conflict exists.
            const newId = characters[parsedCharacter.id] ? Date.now() : parsedCharacter.id;
            const newCharacter = { ...parsedCharacter, id: newId };

            setCharacters(prev => ({
                ...prev,
                [newId]: newCharacter
            }));
            setActiveCharacterId(newId);
            setImportModalOpen(false);
            alert(`Character "${newCharacter.characterName || 'Unnamed Character'}" imported successfully!`);
        } else {
            throw new Error("Invalid or missing character data/ID.");
        }
    } catch (error) {
        console.error("Failed to import character:", error);
        alert("Could not import character. The data may be corrupt or in an invalid format.");
    }
  };

  const handleLongRest = () => {
    setInactiveAbilityButtons([]);
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

      return {
        ...prev,
        ...newVitals,
        attributes: newAttributes,
        momentum: false,
      };
    });

    setHighlightedFields(fieldsToHighlight);
    setTimeout(() => {
      setHighlightedFields([]);
    }, 1500); // Match animation duration
  };

  const handleFieldChange = (fieldName, value) => {
    setCharacter(prev => ({ ...prev, [fieldName]: value }));
  };
  
  const handleAttributeChange = (index, newAttribute) => {
    setCharacter(prevCharacter => {
      const newAttributes = prevCharacter.attributes.map((attr, i) =>
        i === index ? newAttribute : attr
      );
      return { ...prevCharacter, attributes: newAttributes };
    });
  };

  const handleAbilitiesChange = (newAbilities) => {
    setCharacter(prev => ({ ...prev, abilities: newAbilities }));
  };

  const handleAddAbility = () => {
    const newAbility = { 
      id: Date.now(), 
      label: '', 
      text: '' 
    };
    handleAbilitiesChange([...character.abilities, newAbility]);
  };

    const handleSkillChange = (index, updatedSkill) => {
    setCharacter(prev => {
      const newSkills = [...prev.skills];
      const currentSkill = newSkills[index];

      // If the level is being updated, handle the toggle-off logic
      if (updatedSkill.level !== undefined && updatedSkill.level === currentSkill.level) {
        updatedSkill.level -= 1;
      }

      newSkills[index] = { ...currentSkill, ...updatedSkill };
      return { ...prev, skills: newSkills };
    });
  };

  const handleHealthChange = (newHealth) => {
    const steadfastAttribute = character.attributes.find(attr => attr.name === 'Steadfast');
    const steadfastMax = Number(steadfastAttribute?.max || 0);
    const minHealthMax = 5 + steadfastMax;

    if (newHealth.max !== '' && Number(newHealth.max) < minHealthMax) {
      newHealth.max = String(minHealthMax);
    }

    handleFieldChange('health', newHealth);
  };

  const handleVigorChange = (newVigor) => {
    const daringAttribute = character.attributes.find(attr => attr.name === 'Daring');
    const daringMax = Number(daringAttribute?.max || 0);
    const minVigorMax = 3 + daringMax;

    if (newVigor.max !== '' && Number(newVigor.max) < minVigorMax) {
      newVigor.max = String(minVigorMax);
    }

    handleFieldChange('vigor', newVigor);
  };

  const handleDashesChange = (newDashes) => {
    handleFieldChange('dashes', newDashes);
  };

  const handleDRChange = (newValue) => {
    setCharacter(prev => ({ ...prev, damageReduction: newValue }));
  };

  const handleArmorChange = (newArmor) => {
    let newDR = 0;
    let newMaxDashes = 6;

    if (newArmor === 'Light' || newArmor === 'Medium') {
      newMaxDashes = 5;
    } else if (newArmor === 'Heavy') {
      newMaxDashes = 4;
    }

    if (newArmor === 'Medium') {
      newDR = 1;
    } else if (newArmor === 'Heavy') {
      newDR = 2;
    }

    setCharacter(prev => {
      const newDashesValue = newMaxDashes;
      return {
        ...prev,
        armor: newArmor,
        damageReduction: newDR,
        dashes: { ...prev.dashes, max: String(newMaxDashes), value: newDashesValue }
      };
    });
  };

  const handleAddTechnique = (columnIndex) => {
    const newTechnique = {
      id: Date.now(),
      column: columnIndex,
      ...newTechniqueTemplate
    };
    setCharacter(prev => ({
      ...prev,
      combatTechniques: [...prev.combatTechniques, newTechnique]
    }));
  };

  const handleTechniqueChange = (id, updatedTechnique) => {
    setCharacter(prev => ({
      ...prev,
      combatTechniques: prev.combatTechniques.map(t => t.id === id ? updatedTechnique : t)
    }));
  };

  const handleRemoveTechnique = (id) => {
    setCharacter(prev => ({
      ...prev,
      combatTechniques: prev.combatTechniques.filter(t => t.id !== id)
    }));
  };

  const handleAbilityButtonClick = (abilityId) => {
    const ability = character.abilities.find(a => a.id === abilityId);
    if (!ability) return;

    const costMatch = ability.label.match(/\{(.+?)\}/);
    if (!costMatch) { // Abilities with no cost
      setInactiveAbilityButtons(prev => [...prev, abilityId]);
      return;
    }

    const costString = costMatch[1];
    const upperCaseCostString = costString.toUpperCase();

    if (upperCaseCostString === '1 MOMENTUM') {
      // Handle Momentum cost directly
      if (character.momentum) {
        setCharacter(prev => ({ ...prev, momentum: false }));
        setInactiveAbilityButtons(ib => [...ib, abilityId]);
      }
    } else {
      const parts = costString.split(' ');
      const cost = parseInt(parts[0], 10);
      const resource = parts[1];

      if (resource.toLowerCase() === 'shrouded') {
        // Handle Shrouded cost directly
        setCharacter(prev => {
          const attributeIndex = prev.attributes.findIndex(attr => attr.name.toLowerCase() === 'shrouded');
          if (attributeIndex !== -1 && prev.attributes[attributeIndex].value >= cost) {
            const newAttributes = [...prev.attributes];
            newAttributes[attributeIndex] = { ...newAttributes[attributeIndex], value: newAttributes[attributeIndex].value - cost };
            setInactiveAbilityButtons(ib => [...ib, abilityId]);
            return { ...prev, attributes: newAttributes };
          }
          return prev; // Not enough shrouded
        });
      } else {
        // For other attribute costs, open the modal
        setPaymentModalAbility(ability);
      }
    }
  };

  const handlePaymentConfirm = (ability, resource) => {
    const costMatch = ability.label.match(/\{(.+?)\}/);
    const cost = parseInt(costMatch[1].split(' ')[0], 10);

    setCharacter(prev => {
      const attributeIndex = prev.attributes.findIndex(attr => attr.name.toLowerCase() === resource.toLowerCase());
      if (attributeIndex !== -1 && prev.attributes[attributeIndex].value >= cost) {
        const newAttributes = [...prev.attributes];
        newAttributes[attributeIndex] = { ...newAttributes[attributeIndex], value: newAttributes[attributeIndex].value - cost };
        setInactiveAbilityButtons(ib => [...ib, ability.id]);
        return { ...prev, attributes: newAttributes };
      }
      return prev;
    });

    setPaymentModalAbility(null);
  };

  const handleMomentumToggle = () => {
    const newMomentumState = !character.momentum;
    if (newMomentumState) { // If gaining momentum
      const momentumAbilities = character.abilities
        .filter(a => a.label.includes('{1 MOMENTUM}'))
        .map(a => a.id);
      setInactiveAbilityButtons(prev => prev.filter(id => !momentumAbilities.includes(id)));
    }
    handleFieldChange('momentum', newMomentumState);
  };

  const handleLockToggle = () => {
    setIsLocked(prev => !prev);
  };

  const checkAffordability = (ability) => {
    const costMatch = ability.label.match(/\{(.+?)\}/);
    if (!costMatch) return true; // No cost is always affordable

    const costString = costMatch[1];
    let cost = 1;
    let resource = '';

    {
      const parts = costString.trim().split(' ');
      cost = parseInt(parts[0], 10);
      resource = parts[1];
    }

    if (resource === 'Momentum') {
      return character.momentum;
    } else {
      const primaryAttribute = character.attributes.find(attr => attr.name.toLowerCase() === resource.toLowerCase());
      const canAffordPrimary = primaryAttribute && primaryAttribute.value >= cost;

      if (resource.toLowerCase() === 'shrouded') {
        return canAffordPrimary;
      }

      const resolveAttribute = character.attributes.find(attr => attr.name === 'Resolve');
      const canAffordResolve = resolveAttribute && resolveAttribute.value >= cost;
      return canAffordPrimary || canAffordResolve;
    }
  };

  if (!activeCharacterId || !character) {
    return (
      <CharacterModal
        isOpen={true}
        canClose={false}
        characters={characters}
        onLoad={handleLoadCharacter}
        onDelete={handleDeleteCharacter}
        onNewCharacter={handleReset}
      />
    );
  }

  return (
    <>
      <div className="sheet">
      {isDataModalOpen && 
        <DataModal 
          characterData={character} 
          onClose={() => setDataModalOpen(false)} 
        />
      }
      {paymentModalAbility && 
        <PaymentChoiceModal 
          ability={paymentModalAbility} 
          character={character} 
          onClose={() => setPaymentModalAbility(null)} 
          onConfirm={(resource) => handlePaymentConfirm(paymentModalAbility, resource)} 
        />
      }

      <div className="stat-grid">
        <div className="attributes-container">
          {(character.attributes || []).map((attr, index) => (
            <AttributeBox 
              key={attr.name}
              name={attr.name}
              value={attr.value}
              max={attr.max}
              onChange={(updatedAttribute) => handleAttributeChange(index, updatedAttribute)}
              canExceedMax={attr.name === 'Resolve'}
              isHighlighted={highlightedFields.includes(attr.name)}
              isLocked={isLocked}
            />
          ))}
        </div>
        <div className="stat-action-buttons">
          <div className="stat-button-row">
            <button className="action-btn icon-btn" onClick={handleQuickRest} title="Quick Rest"><img src="break.png" alt="Quick Rest" /></button>
            <button className="action-btn icon-btn" onClick={handleLongRest} title="Long Rest"><img src="rest.png" alt="Long Rest" /></button>
          </div>
          <div className="stat-button-row">
            <button className="action-btn icon-btn" onClick={handleNewRound} title="New Round"><img src="reset.png" alt="New Round" /></button>
            <button className="action-btn icon-btn" onClick={handleLockToggle} title={isLocked ? 'Unlock Sheet' : 'Lock Sheet'}>
              <img src={isLocked ? 'locked.png' : 'unlocked.png'} alt={isLocked ? 'Unlock Sheet' : 'Lock Sheet'} />
            </button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="column">
          <SectionBox title="Abilities" isCollapsible={true}>
            <DynamicList 
              items={character.abilities}
              setItems={handleAbilitiesChange}
            >
              {(ability, onAbilityChange, onAbilityRemove) => {
                const isAffordable = checkAffordability(ability);
                const isUsed = inactiveAbilityButtons.includes(ability.id) || !isAffordable;

                return (
                  <DynamicListItem key={ability.id} onRemove={() => onAbilityRemove(ability.id)}>
                    <TabbedTextarea 
                      item={ability} 
                      onChange={onAbilityChange} 
                      onUse={!ability.label.includes('(PA)') ? () => handleAbilityButtonClick(ability.id) : undefined}
                      isUsed={isUsed}
                      isLocked={isLocked}
                    />
                  </DynamicListItem>
                );
              }}
            </DynamicList>
            <div className="add-btn-container">
              <button className="add-btn" onClick={handleAddAbility}>
                + Ability
              </button>
            </div>
          </SectionBox>
          {[...(character.combatTechniques || []).filter(t => t.column === 0), ...(isMediumScreen ? (character.combatTechniques || []).filter(t => t.column === 2) : [])].map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
              isLocked={isLocked}
            />
          ))}
          {!isMediumScreen && <button className="add-technique-btn" onClick={() => handleAddTechnique(0)}>+ Combat Technique</button>}
          {isMediumScreen && <button className="add-technique-btn" onClick={() => handleAddTechnique(2)}>+ Combat Technique</button>}
        </div>
        <div className="column">
          <SectionBox
            title={character.characterName}
            isCollapsible={true}
            onTitleChange={(value) => handleFieldChange('characterName', value)}
            isHeaderEditable={true}
            placeholder="Character Name"
          >
            <TabbedTextarea 
              item={character.bio} 
              onChange={(id, updatedItem) => handleFieldChange('bio', updatedItem)} 
              isLabelEditable={false}
              isLocked={isLocked} 
            />
            <TabbedTextarea 
              item={character.beliefs} 
              onChange={(id, updatedItem) => handleFieldChange('beliefs', updatedItem)} 
              isLabelEditable={false}
              isLocked={isLocked} 
            />
            <TabbedTextarea 
              item={character.goals} 
              onChange={(id, updatedItem) => handleFieldChange('goals', updatedItem)} 
              isLabelEditable={false}
              isLocked={isLocked} 
            />
          </SectionBox>
          <SectionBox
            title={character.archetype}
            isCollapsible={true}
            onTitleChange={(value) => handleFieldChange('archetype', value)}
            isHeaderEditable={true}
            placeholder="Archetype"
          >
            <AutosizeTextarea
              placeholder="Archetype Description..."
              value={character.archetypeBody}
              onChange={(e) => handleFieldChange('archetypeBody', e.target.value)}
            />
          </SectionBox>
          {(character.combatTechniques || []).filter(t => t.column === 1).map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
              isLocked={isLocked}
            />
          ))}
          <button className="add-technique-btn" onClick={() => handleAddTechnique(1)}>+ Combat Technique</button>
        </div>
        <div className="column">
          <div className="sub-column-container">
            <div className="sub-column skills-sub-column">
              <FloatingHeader title="Skills" />
              <div className="skills-list">
                {(character.skills || []).map((skill, index) => (
                                  <SkillItem 
                  key={index}
                  name={skill.name}
                  level={skill.level}
                  isEditable={skill.isEditable}
                  onChange={(updatedSkill) => handleSkillChange(index, updatedSkill)}
                  isLocked={isLocked}
                />
                ))}
              </div>
            </div>
            <div className="sub-column health-sub-column">
              <div className="vitals-box-group">
                <div className="vitals-row">
                                    <VitalsBox 
                    name={character.health.name}
                    value={character.health.value}
                    max={character.health.max}
                    onChange={handleHealthChange}
                    isHighlighted={highlightedFields.includes('Health')}
                    isLocked={isLocked}
                  />
                                    <VitalsBox 
                    name={character.vigor.name}
                    value={character.vigor.value}
                    max={character.vigor.max}
                    onChange={handleVigorChange}
                    isHighlighted={highlightedFields.includes('Vigor')}
                    isLocked={isLocked}
                  />
                </div>
                <div className="vitals-row">
                                    <VitalsBox 
                      name={character.dashes.name}
                      value={character.dashes.value}
                      max={character.dashes.max}
                      onChange={handleDashesChange}
                      isHighlighted={highlightedFields.includes('Dashes')}
                      isLocked={isLocked}
                  />
                                                      <NumericInputBox 
                    name="DR"
                    value={character.damageReduction}
                    onChange={handleDRChange}
                  />
                </div>
              </div>
              <div className="secondary-stats-container">
                <div className="armor-box">
                  <FloatingHeader title="Armor" />
                  <select 
                    className="armor-select"
                    value={character.armor}
                    onChange={(e) => handleArmorChange(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
                <MomentumBox 
                  isActive={character.momentum}
                  onClick={handleMomentumToggle}
                />
              </div>
              <SectionBox title="Inventory" isCollapsible={true}>
                <ExpandingList 
                  items={character.inventory}
                  setItems={(newItems) => handleFieldChange('inventory', newItems)}
                />
              </SectionBox>
            </div>
          </div>
          {(character.combatTechniques || []).filter(t => t.column === 2).map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
              isLocked={isLocked}
            />
          ))}
          {!isMediumScreen && <button className="add-technique-btn" onClick={() => handleAddTechnique(2)}>+ Combat Technique</button>}
        </div>
      </div>
    </div>
    <ActionButtons onOpenCharactersModal={() => setCharacterModalOpen(true)} />
    <CharacterModal
      isOpen={isCharacterModalOpen}
      canClose={true}
      onClose={() => setCharacterModalOpen(false)}
      characters={characters}
      onLoad={handleLoadCharacter}
      onDelete={handleDeleteCharacter}
      onNewCharacter={handleReset}
      onImport={handleImport}
    />
    <ImportCharacterModal 
      isOpen={isImportModalOpen}
      onClose={() => setImportModalOpen(false)}
      onImport={handleImportCharacter}
    />
    </>
  );
}

export default App;
