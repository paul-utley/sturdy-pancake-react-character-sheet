import React, { useState, useEffect } from 'react';
import SectionBox from '../SectionBox/SectionBox';
import DynamicList from '../DynamicList/DynamicList';
import DynamicListItem from '../DynamicListItem/DynamicListItem';
import TraitSelectionModal from '../TraitSelectionModal/TraitSelectionModal';
import TabbedTextarea from '../TabbedTextarea/TabbedTextarea';
import CombatTechniqueAttributeInput from '../CombatTechniqueAttributeInput/CombatTechniqueAttributeInput';

import AutosizeTextarea from '../AutosizeTextarea/AutosizeTextarea';
import combatTechniqueCosts from '../../data/combatTechniqueCosts';
import './CombatTechniqueBox.css';



const extractCostFromLabel = (label) => {
    if (!label) return 0;
    const match = label.match(/{(\d+)\s*TP}/);
    return match ? parseInt(match[1], 10) : 0;
};

const CombatTechniqueBox = ({ technique, onChange, onRemove, isCollapsible, isLocked }) => {
  const [isTraitModalOpen, setIsTraitModalOpen] = useState(false);
  useEffect(() => {
    const calculateTotalCost = () => {
      let cost = 0;
      const { role, armament, damage, zone, range, traits } = technique;

      const getCost = (category, key) => {
        if (!key) return 0;
        const item = combatTechniqueCosts[category]?.options?.find(c => c.key === key);
        return item ? item.value : 0;
      };

      cost += getCost('role', role);
      cost += getCost('armament', armament);
      cost += getCost('damage', damage);

      // Only add zone cost if the role is Melee or Versatile
      if (role === 'Melee Combat' || role === 'Versatile') {
        cost += getCost('zone', zone);
      }

      // Only add range cost if the role is Ranged or Versatile
      if (role === 'Ranged Combat' || role === 'Versatile') {
        cost += getCost('range', range);
      }

      if (traits) {
        traits.forEach(trait => {
          cost += extractCostFromLabel(trait.label);
        });
      }

      if (technique.totalCost !== cost) {
        onChange({ ...technique, totalCost: cost });
      }
    };

    calculateTotalCost();
  }, [technique, onChange]);
  const handleTitleChange = (newTitle) => {
    onChange({ ...technique, title: newTitle });
  };

  const handleBodyChange = (e) => {
    onChange({ ...technique, body: e.target.value });
  };

  const handleDamageChange = (newDamage) => {
    onChange({ ...technique, damage: newDamage });
  };

  const handleZoneChange = (newZone) => {
    onChange({ ...technique, zone: newZone });
  };

  const handleArmamentChange = (newArmament) => {
    onChange({ ...technique, armament: newArmament });
  };

  const handleRoleChange = (newRole) => {
    onChange({ ...technique, role: newRole });
  };

  const handleRangeChange = (newRange) => {
    onChange({ ...technique, range: newRange });
  };

  const handleTraitsChange = (newTraits) => {
    onChange({ ...technique, traits: newTraits });
  };

  const handleSelectTrait = (traitOption) => {
    const newTrait = {
        id: Date.now(),
        label: `${traitOption.label} {${traitOption.cost} TP}`,
        text: traitOption.text,
    };
    handleTraitsChange([...technique.traits, newTrait]);
    setIsTraitModalOpen(false);
  };

  return (
    <SectionBox
      className="technique-section-box"
      title={technique.title}
      onTitleChange={handleTitleChange}
      isHeaderEditable={true}
      placeholder="Technique Name"
      onRemove={onRemove}
      isCollapsible={isCollapsible}
      isLocked={isLocked}
      totalCost={technique.totalCost}
    >
      <AutosizeTextarea
        placeholder="Technique Description..."
        value={technique.body}
        onChange={handleBodyChange}
      />
      <div className="technique-selectors-container">
        <CombatTechniqueAttributeInput
          label="Armament"
          value={technique.armament}
          onChange={handleArmamentChange}
          options={combatTechniqueCosts.armament.options}
        />
        <CombatTechniqueAttributeInput
          label="Role"
          value={technique.role}
          onChange={handleRoleChange}
          options={combatTechniqueCosts.role.options}
        />
      </div>
      <div className="technique-stats-container">
        <CombatTechniqueAttributeInput
          label="Damage"
          value={technique.damage}
          onChange={handleDamageChange}
          options={combatTechniqueCosts.damage.options}
        />
        {(technique.role === 'Melee Combat' || technique.role === 'Versatile') && (
          <CombatTechniqueAttributeInput
            label="Zone"
            value={technique.zone}
            onChange={handleZoneChange}
            options={combatTechniqueCosts.zone.options}
            units={combatTechniqueCosts.zone.units}
          />
        )}
      </div>
      <div className="technique-range-container">
        {(technique.role === 'Ranged Combat' || technique.role === 'Versatile') && (
            <CombatTechniqueAttributeInput
              label="Range"
              value={technique.range}
              onChange={handleRangeChange}
              options={combatTechniqueCosts.range.options}
              units={combatTechniqueCosts.range.units}
            />
        )}
      </div>
      <div className="traits-section">
        <div className="traits-label">Traits</div>
        <DynamicList
          items={technique.traits}
          setItems={handleTraitsChange}
        >
          {(trait, onTraitChange, onTraitRemove) => (
            <DynamicListItem key={trait.id} onRemove={() => onTraitRemove(trait.id)}>
              <TabbedTextarea item={trait} onChange={onTraitChange} isLocked={isLocked} />
            </DynamicListItem>
          )}
        </DynamicList>
        <div className="add-btn-container">
          <button className="add-btn" onClick={() => setIsTraitModalOpen(true)}>
            + Trait
          </button>
        </div>
      </div>
      <TraitSelectionModal
        isOpen={isTraitModalOpen}
        onClose={() => setIsTraitModalOpen(false)}
        traitOptions={combatTechniqueCosts.traits.options}
        onSelect={handleSelectTrait}
      />
    </SectionBox>
  );
};

export default CombatTechniqueBox;
