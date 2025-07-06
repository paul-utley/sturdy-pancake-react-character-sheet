import React from 'react';
import InsetBox from '../InsetBox/InsetBox';
import LevelCheckboxes from '../LevelCheckboxes/LevelCheckboxes';
import './SkillItem.css';

const SkillItem = ({ name, level, onChange, isEditable = false, isLocked = false }) => {
  const handleNameChange = (e) => {
    // Save on blur
    onChange({ name: e.currentTarget.textContent, level });
  };

  const handleLevelChange = (newLevel) => {
    onChange({ name, level: newLevel });
  };

  return (
    <div className="skill-item">
      <InsetBox>
        {isEditable ? (
          <span 
            className="skill-name"
            contentEditable={!isLocked}
            suppressContentEditableWarning={true} // React warning for uncontrolled component
            onBlur={handleNameChange}
          >
            {name}
          </span>
        ) : (
          <span className="skill-name">{name}</span>
        )}
      </InsetBox>
      <LevelCheckboxes level={level} onChange={handleLevelChange} isLocked={isLocked} />
    </div>
  );
};

export default SkillItem;
