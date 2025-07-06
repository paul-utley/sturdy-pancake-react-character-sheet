import React from 'react';
import './DynamicListItem.css';

const DynamicListItem = ({ children, onRemove, dragHandleListeners }) => {
  return (
    <div className="dynamic-list-item">
      {React.cloneElement(children, { dragHandleListeners })}
      <button onClick={onRemove} className="remove-item-btn">×</button>
    </div>
  );
};

export default DynamicListItem;
