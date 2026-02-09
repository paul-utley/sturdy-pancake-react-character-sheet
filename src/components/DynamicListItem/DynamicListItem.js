import React from 'react';
import './DynamicListItem.css';

const DynamicListItem = ({ children, onRemove, dragHandleListeners, isLocked = false }) => {
  return (
    <div className="dynamic-list-item">
      {React.cloneElement(children, { dragHandleListeners })}
      {isLocked ? null : <button onClick={onRemove} className="remove-item-btn">×</button>}
    </div>
  );
};

export default DynamicListItem;
