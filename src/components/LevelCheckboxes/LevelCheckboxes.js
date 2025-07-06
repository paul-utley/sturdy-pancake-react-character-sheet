import React from 'react';
import './LevelCheckboxes.css';

const LevelCheckboxes = ({ level, onChange, isLocked = false }) => {
  return (
    <div className="level-checkbox-group">
      {[1, 2, 3].map((boxLevel) => (
        <input
          key={boxLevel}
          type="checkbox"
          checked={level >= boxLevel}
          onChange={() => onChange(boxLevel)}
          disabled={isLocked}
          className="level-checkbox"
        />
      ))}
    </div>
  );
};

export default LevelCheckboxes;
