import React from 'react';
import SectionBox from '../SectionBox/SectionBox';
import DynamicList from '../DynamicList/DynamicList';
import DynamicListItem from '../DynamicListItem/DynamicListItem';
import TabbedTextarea from '../TabbedTextarea/TabbedTextarea';
import CombatTechniqueBox from '../CombatTechniqueBox/CombatTechniqueBox';
import AutosizeTextarea from '../AutosizeTextarea/AutosizeTextarea';
import SkillItem from '../SkillItem/SkillItem';
import VitalsBox from '../VitalsBox/VitalsBox';
import NumericInputBox from '../NumericInputBox/NumericInputBox';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import MomentumBox from '../MomentumBox/MomentumBox';
import ExpandingList from '../ExpandingList/ExpandingList';

const DesktopLayout = ({
  character,
  isLocked,
  isMediumScreen,
  highlightedFields,
  inactiveAbilityButtons,
  checkAffordability,
  handleAbilityButtonClick,
  handleAddAbility,
  handleAbilitiesChange,
  handleFieldChange,
  handleSkillChange,
  handleTechniqueChange,
  handleRemoveTechnique,
  handleAddTechnique,
  handleHealthChange,
  handleVigorChange,
  handleDashesChange,
  handleDRChange,
  handleArmorChange,
  handleMomentumToggle,
}) => {
  const techniquesCol0 = (character.combatTechniques || []).filter(t => t.column === 0);
  const techniquesCol1 = (character.combatTechniques || []).filter(t => t.column === 1);
  const techniquesCol2 = (character.combatTechniques || []).filter(t => t.column === 2);

  return (
    <div className="main-content">
      {/* Column 0: Abilities + col-0 techniques (+ col-2 on medium screens) */}
      <div className="column">
        <SectionBox title="Abilities" isCollapsible={true}>
          <DynamicList items={character.abilities} setItems={handleAbilitiesChange}>
            {(ability, onAbilityChange, onAbilityRemove) => {
              const isUsed = inactiveAbilityButtons.includes(ability.id) || !checkAffordability(ability);
              return (
                <DynamicListItem key={ability.id} onRemove={() => onAbilityRemove(ability.id)} isLocked={isLocked}>
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
            <button className="add-btn" onClick={handleAddAbility}>+ Ability</button>
          </div>
        </SectionBox>

        {[...techniquesCol0, ...(isMediumScreen ? techniquesCol2 : [])].map(technique => (
          <CombatTechniqueBox
            key={technique.id}
            technique={technique}
            onChange={(updated) => handleTechniqueChange(technique.id, updated)}
            onRemove={() => handleRemoveTechnique(technique.id)}
            isCollapsible={true}
            isLocked={isLocked}
          />
        ))}

        {!isMediumScreen && (
          <button className="add-technique-btn" onClick={() => handleAddTechnique(0)}>+ Combat Technique</button>
        )}
        {isMediumScreen && (
          <button className="add-technique-btn" onClick={() => handleAddTechnique(2)}>+ Combat Technique</button>
        )}
      </div>

      {/* Column 1: Character identity + col-1 techniques */}
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

        {techniquesCol1.map(technique => (
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

      {/* Column 2: Skills + vitals + inventory + col-2 techniques (full screen only) */}
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
              <MomentumBox isActive={character.momentum} onClick={handleMomentumToggle} />
            </div>
            <SectionBox title="Inventory" isCollapsible={true}>
              <ExpandingList
                items={character.inventory}
                setItems={(newItems) => handleFieldChange('inventory', newItems)}
              />
            </SectionBox>
          </div>
        </div>

        {!isMediumScreen && techniquesCol2.map(technique => (
          <CombatTechniqueBox
            key={technique.id}
            technique={technique}
            onChange={(updated) => handleTechniqueChange(technique.id, updated)}
            onRemove={() => handleRemoveTechnique(technique.id)}
            isCollapsible={true}
            isLocked={isLocked}
          />
        ))}
        {!isMediumScreen && (
          <button className="add-technique-btn" onClick={() => handleAddTechnique(2)}>+ Combat Technique</button>
        )}
      </div>
    </div>
  );
};

export default DesktopLayout;
