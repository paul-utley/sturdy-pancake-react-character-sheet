import React from 'react';
import SectionBox from '../SectionBox/SectionBox';
import SkillItem from '../SkillItem/SkillItem';
import AutosizeTextarea from '../AutosizeTextarea/AutosizeTextarea';
import ExpandingList from '../ExpandingList/ExpandingList';
import TabbedTextarea from '../TabbedTextarea/TabbedTextarea';
import DynamicListItem from '../DynamicListItem/DynamicListItem';
import CombatTechniqueBox from '../CombatTechniqueBox/CombatTechniqueBox';
import VitalsBox from '../VitalsBox/VitalsBox';
import NumericInputBox from '../NumericInputBox/NumericInputBox';
import FloatingHeader from '../FloatingHeader/FloatingHeader';
import MomentumBox from '../MomentumBox/MomentumBox';

const MobileLayout = ({
  activeMobileTab,
  setActiveMobileTab,
  character,
  isLocked,
  highlightedFields,
  inactiveAbilityButtons,
  checkAffordability,
  handleAbilityButtonClick,
  handleAddAbility,
  handleSkillChange,
  handleFieldChange,
  handleAbilitiesChange,
  handleTechniqueChange,
  handleRemoveTechnique,
  handleAddTechnique,
  handleHealthChange,
  handleVigorChange,
  handleDashesChange,
  handleDRChange,
  handleArmorChange,
  handleMomentumToggle,
}) => (
  <div className="mobile-layout">
    <div className="mobile-tabs">
      {['character', 'abilities', 'combat', 'stats'].map((tab, i) => (
        <button
          key={tab}
          className={`mobile-tab ${activeMobileTab === tab ? 'active' : ''}`}
          onClick={() => setActiveMobileTab(tab)}
        >
          {['Core', 'Abilities', 'Combat', 'Stats'][i]}
        </button>
      ))}
    </div>

    <div className="mobile-tab-content">
      {activeMobileTab === 'character' && (
        <div className="active">
          <div className="core-grid">
            <SectionBox title="Skills" isCollapsible={true}>
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
            <SectionBox title="Inventory" isCollapsible={true}>
              <ExpandingList
                items={character.inventory}
                setItems={(newItems) => handleFieldChange('inventory', newItems)}
              />
            </SectionBox>
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
          </div>
        </div>
      )}

      {activeMobileTab === 'abilities' && (
        <div className="active">
          <div className="abilities-grid">
            {(character.abilities || []).map((ability, index) => {
              const isUsed = inactiveAbilityButtons.includes(ability.id) || !checkAffordability(ability);
              return (
                <div key={ability.id} className="ability-card">
                  <DynamicListItem
                    onRemove={() => handleAbilitiesChange(character.abilities.filter((_, i) => i !== index))}
                    isLocked={isLocked}
                  >
                    <TabbedTextarea
                      item={ability}
                      onChange={(id, updatedItem) => {
                        const newAbilities = [...character.abilities];
                        newAbilities[index] = updatedItem;
                        handleAbilitiesChange(newAbilities);
                      }}
                      onUse={!ability.label.includes('(PA)') ? () => handleAbilityButtonClick(ability.id) : undefined}
                      isUsed={isUsed}
                      isLocked={isLocked}
                    />
                  </DynamicListItem>
                </div>
              );
            })}
          </div>
          <div className="add-btn-container">
            <button className="add-btn" onClick={handleAddAbility}>+ Ability</button>
          </div>
        </div>
      )}

      {activeMobileTab === 'combat' && (
        <div className="active">
          <div className="combat-techniques-grid">
            {(character.combatTechniques || []).map(technique => (
              <CombatTechniqueBox
                key={technique.id}
                technique={technique}
                onChange={(updated) => handleTechniqueChange(technique.id, updated)}
                onRemove={() => handleRemoveTechnique(technique.id)}
                isCollapsible={true}
                isLocked={isLocked}
              />
            ))}
          </div>
          <button className="add-technique-btn" onClick={() => handleAddTechnique(0)}>+ Combat Technique</button>
        </div>
      )}

      {activeMobileTab === 'stats' && (
        <div className="active">
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
                <option value="Light">Light (1)</option>
                <option value="Medium">Medium (2)</option>
                <option value="Heavy">Heavy (3)</option>
              </select>
            </div>
            <div className="momentum-box">
              <MomentumBox isActive={character.momentum} onClick={handleMomentumToggle} />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default MobileLayout;
