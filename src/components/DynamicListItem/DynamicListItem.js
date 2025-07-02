import React from 'react';
import './DynamicListItem.css';

const DynamicListItem = ({ children, onRemove }) => {
  return (
    <div className="dynamic-list-item">
      {children}
      <button className="remove-item-btn" onClick={onRemove}>&times;</button>
    </div>
  );
};

export default DynamicListItem;
