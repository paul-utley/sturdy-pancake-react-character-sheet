import React from 'react';
import './DynamicListItem.css';

const DynamicListItem = ({ children, dragHandleListeners }) => {
  return (
    <div className="dynamic-list-item">
      {React.cloneElement(children, { dragHandleListeners })}
    </div>
  );
};

export default DynamicListItem;
