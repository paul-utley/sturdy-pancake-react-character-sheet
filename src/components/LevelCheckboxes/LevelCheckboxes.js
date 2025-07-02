import React from 'react';
import './LevelCheckboxes.css';

const LevelCheckboxes = ({ level, onChange }) => {
  return (
    <div className="level-checkbox-group">
      {[1, 2, 3].map((boxLevel) => (
        <input
          key={boxLevel}
          type="checkbox"
          checked={level >= boxLevel}
          onChange={() => onChange(boxLevel)}
          className="level-checkbox"
        />
      ))}
    </div>
  );
};

export default LevelCheckboxes;
