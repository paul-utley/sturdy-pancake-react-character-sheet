import React, { useState } from 'react';
import './SectionBox.css';

const SectionBox = ({ title, children, isHeaderEditable, onTitleChange, placeholder, onRemove, className, isCollapsible = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible ? false : true);
  return (
    <div className={`section-box ${className || ''} ${isCollapsible && isCollapsed ? 'collapsed' : ''}`}>
      {isCollapsible && 
        <div className="section-collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="collapse-icon">^</span>
        </div>
      }
      {onRemove && <div className="section-remove-btn" onClick={onRemove}>×</div>}
      {isHeaderEditable ? (
        <input
          type="text"
          className="section-header-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <h2>{title}</h2>
      )}
      <div className="section-header-bottom">
        <div className="section-header-cut">

        </div>
      </div>
      <div className="section-box-content">
        {children}
      </div>
    </div>
  );
};

export default SectionBox;
