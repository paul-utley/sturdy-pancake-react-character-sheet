import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '../SortableItem/SortableItem';
import './DynamicList.css';

const DynamicList = ({ items, setItems, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRemoveItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const handleItemChange = (id, updatedItem) => {
    const newItems = items.map((item) => (item.id === id ? updatedItem : item));
    setItems(newItems);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="list-item-container">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {children(item, handleItemChange, handleRemoveItem)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DynamicList;
