import React, { useState } from 'react';
import useMediaQuery from './hooks/useMediaQuery';
import usePersistentState from './hooks/usePersistentState';
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
import ExportModal from './components/ExportModal/ExportModal';

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
    { name: 'Resolve', value: 0, max: '' },
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
  dashes: { name: 'Dashes', value: 0, max: '' },
  armor: '',
  damageReduction: { name: 'DR', value: 0, max: '' },
  inventory: [''],
  combatTechniques: [{ id: 1, column: 0, title: '', body: '', damage: { d6: '', d4: '' }, zone: '', armament: '', traits: [{ id: 1, label: '', text: '' }] }],
  momentum: false,
};

const newTechniqueTemplate = {
  title: '', 
  body: '', 
  damage: { d6: '', d4: '' }, 
  zone: '', 
  armament: '', 
  traits: [{ id: 1, label: '', text: '' }]
};

function App() {
      const [character, setCharacter] = usePersistentState('character', initialCharacterState);
    const [highlightedFields, setHighlightedFields] = useState([]);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
  const isMediumScreen = useMediaQuery('(max-width: 1299px)');
  const [inactiveAbilityButtons, setInactiveAbilityButtons] = useState([]);

  const handleDataUpdate = (newData) => {
    if (window.confirm('Are you sure you want to update the character with this new data? This cannot be undone.')) {
      // Here, we can add more robust validation or merging logic if needed.
      // For now, we'll just replace the state.
      setCharacter(newData);
    }
  };

    const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new character? All current data will be lost.')) {
      setCharacter(initialCharacterState);
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

      const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleLongRest = () => {
    setInactiveAbilityButtons([]);
    const fieldsToHighlight = [];

    setCharacter(prev => {
      const vitalsToReset = ['health', 'vigor', 'dashes', 'damageReduction'];
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
    handleFieldChange('health', newHealth);
  };

  const handleVigorChange = (newVigor) => {
    handleFieldChange('vigor', newVigor);
  };

  const handleDashesChange = (newDashes) => {
    handleFieldChange('dashes', newDashes);
  };

  const handleDRChange = (newDR) => {
    handleFieldChange('damageReduction', newDR);
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
    setInactiveAbilityButtons(prev =>
      prev.includes(abilityId)
        ? prev.filter(id => id !== abilityId)
        : [...prev, abilityId]
    );
  };

  const handleMomentumToggle = () => {
    handleFieldChange('momentum', !character.momentum);
  };

  return (
    <div className="sheet">
      {isExportModalOpen && 
        <ExportModal 
          characterData={character} 
          onClose={() => setExportModalOpen(false)} 
          onUpdate={handleDataUpdate} 
        />
      }
      <ActionButtons onReset={handleReset} onNewRound={handleNewRound} onLongRest={handleLongRest} onExport={handleExport} />
      <div className="stat-grid">
        {character.attributes.map((attr, index) => (
                      <AttributeBox 
              key={attr.name}
              name={attr.name}
              value={attr.value}
              max={attr.max}
              onChange={(updatedAttribute) => handleAttributeChange(index, updatedAttribute)}
              canExceedMax={attr.name === 'Resolve'}
              isHighlighted={highlightedFields.includes(attr.name)}
            />
        ))}
      </div>
      <div className="main-content">
        <div className="column">
          <SectionBox title="Abilities" isCollapsible={true}>
            <div className="ability-buttons">
              {character.abilities
                .filter(ability => ability.label && ability.label.includes('(1R)'))
                .map(ability => (
                  <div 
                    key={ability.id} 
                    className={`ability-button ${!inactiveAbilityButtons.includes(ability.id) ? 'active' : 'inactive'}`}
                    onClick={() => handleAbilityButtonClick(ability.id)}
                  >
                    <span>{ability.label.split('(1R)')[0].trim()}</span>
                  </div>
              ))}
            </div>
            <DynamicList 
              items={character.abilities} 
              setItems={handleAbilitiesChange} 
              placeholder="New Ability"
              addButtonText="+ Ability"
              isCollapsible={true}
            >{(item, onChange, onRemove) => (
                <DynamicListItem key={item.id} onRemove={() => onRemove(item.id)}>
                  <TabbedTextarea item={item} onChange={onChange} />
                </DynamicListItem>
              )}
            </DynamicList>
          </SectionBox>
          {[...character.combatTechniques.filter(t => t.column === 0), ...(isMediumScreen ? character.combatTechniques.filter(t => t.column === 2) : [])].map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
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
            />
            <TabbedTextarea 
              item={character.beliefs} 
              onChange={(id, updatedItem) => handleFieldChange('beliefs', updatedItem)} 
              isLabelEditable={false} 
            />
            <TabbedTextarea 
              item={character.goals} 
              onChange={(id, updatedItem) => handleFieldChange('goals', updatedItem)} 
              isLabelEditable={false} 
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
          {character.combatTechniques.filter(t => t.column === 1).map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
            />
          ))}
          <button className="add-technique-btn" onClick={() => handleAddTechnique(1)}>+ Combat Technique</button>
        </div>
        <div className="column">
          <div className="sub-column-container">
            <div className="sub-column skills-sub-column">
              <FloatingHeader title="Skills" />
              <div className="skills-list">
                {character.skills.map((skill, index) => (
                                  <SkillItem 
                  key={index}
                  name={skill.name}
                  level={skill.level}
                  isEditable={skill.isEditable}
                  onChange={(updatedSkill) => handleSkillChange(index, updatedSkill)}
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
                  />
                                    <VitalsBox 
                    name={character.vigor.name}
                    value={character.vigor.value}
                    max={character.vigor.max}
                    onChange={handleVigorChange}
                    isHighlighted={highlightedFields.includes('Vigor')}
                  />
                </div>
                <div className="vitals-row">
                                    <VitalsBox 
                      name={character.dashes.name}
                      value={character.dashes.value}
                      max={character.dashes.max}
                      onChange={handleDashesChange}
                      isHighlighted={highlightedFields.includes('Dashes')}
                  />
                                                      <VitalsBox 
                    name={character.damageReduction.name}
                    value={character.damageReduction.value}
                    max={character.damageReduction.max}
                    onChange={handleDRChange}
                    canExceedMax={true}
                    isHighlighted={highlightedFields.includes('DR')}
                  />
                </div>
              </div>
              <div className="secondary-stats-container">
                <div className="armor-box">
                  <FloatingHeader title="Armor" />
                  <select 
                    className="armor-select"
                    value={character.armor}
                    onChange={(e) => handleFieldChange('armor', e.target.value)}
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
          {!isMediumScreen && character.combatTechniques.filter(t => t.column === 2).map(technique => (
            <CombatTechniqueBox
              key={technique.id}
              technique={technique}
              onChange={(updated) => handleTechniqueChange(technique.id, updated)}
              onRemove={() => handleRemoveTechnique(technique.id)}
              isCollapsible={true}
            />
          ))}
          {!isMediumScreen && <button className="add-technique-btn" onClick={() => handleAddTechnique(2)}>+ Combat Technique</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
