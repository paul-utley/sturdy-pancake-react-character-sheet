import React from 'react';
import './ExpandingList.css';

const ExpandingList = ({ items, setItems }) => {
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;

    // If the last item is being edited and it's not empty, add a new empty item
    if (index === items.length - 1 && value !== '') {
      newItems.push('');
    }

    setItems(newItems);
  };

  return (
    <div className="expanding-list">
      {items.map((item, index) => (
        <div key={index} className="expanding-list-item">
          <span className="list-bullet">•</span>
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="New item..."
          />
          {index < items.length - 1 && (
            <button onClick={() => handleRemoveItem(index)} className="remove-inventory-item-btn">×</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpandingList;
