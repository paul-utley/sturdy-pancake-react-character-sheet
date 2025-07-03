import React from 'react';
import SectionBox from '../SectionBox/SectionBox';
import DynamicList from '../DynamicList/DynamicList';
import DynamicListItem from '../DynamicListItem/DynamicListItem';
import TabbedTextarea from '../TabbedTextarea/TabbedTextarea';
import DamageInput from '../DamageInput/DamageInput';
import ZoneInput from '../ZoneInput/ZoneInput';
import ArmamentInput from '../ArmamentInput/ArmamentInput';
import RoleInput from '../RoleInput/RoleInput';
import AutosizeTextarea from '../AutosizeTextarea/AutosizeTextarea';
import './CombatTechniqueBox.css';

const CombatTechniqueBox = ({ technique, onChange, onRemove, isCollapsible }) => {
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

  const handleTraitsChange = (newTraits) => {
    onChange({ ...technique, traits: newTraits });
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
    >
      <AutosizeTextarea
        placeholder="Technique Description..."
        value={technique.body}
        onChange={handleBodyChange}
      />
      <div className="technique-stats-container">
        <DamageInput
          d6={technique.damage.d6}
          d4={technique.damage.d4}
          onChange={handleDamageChange}
        />
        <ZoneInput
          value={technique.zone}
          onChange={handleZoneChange}
        />
      </div>
      <div className="technique-selectors-container">
        <ArmamentInput
          value={technique.armament}
          onChange={handleArmamentChange}
        />
        <RoleInput
          value={technique.role}
          onChange={handleRoleChange}
        />
      </div>
      <div className="traits-section">
        <div className="traits-label">Traits</div>
        <DynamicList
          items={technique.traits}
          setItems={handleTraitsChange}
          addButtonText="+ Trait"
        >
          {(trait, onTraitChange, onTraitRemove) => (
            <DynamicListItem key={trait.id} onRemove={() => onTraitRemove(trait.id)}>
              <TabbedTextarea item={trait} onChange={onTraitChange} />
            </DynamicListItem>
          )}
        </DynamicList>
      </div>
    </SectionBox>
  );
};

export default CombatTechniqueBox;
