import React from 'react';
import './DynamicList.css';

const DynamicList = ({ items, setItems, addButtonText, children, newItemTemplate }) => {

  const handleAddItem = () => {
    const newItem = { 
      id: Date.now(), 
      ...(newItemTemplate || { label: '', text: '' }) 
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const handleItemChange = (id, updatedItem) => {
    const newItems = items.map((item) => (item.id === id ? updatedItem : item));
    setItems(newItems);
  };

  return (
    <>
      <div className="list-item-container">
        {items.map((item) => 
          children(item, handleItemChange, handleRemoveItem)
        )}
      </div>
      <div className="add-btn-container">
        <button className="add-btn" onClick={handleAddItem}>{addButtonText}</button>
      </div>
    </>
  );
};

export default DynamicList;
