import React, { useRef, useLayoutEffect } from 'react';
import './TabbedTextarea.css';

const TabbedTextarea = ({ item, onChange, onUse, onRemove, isUsed, isLabelEditable = true, dragHandleListeners, isLocked = false }) => {
  const labelRef = useRef(null);
  const sizerRef = useRef(null);
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (labelRef.current && sizerRef.current) {
      const newWidth = sizerRef.current.scrollWidth + 2; // Add a small buffer
      labelRef.current.style.width = `${newWidth}px`;
    }
  }, [item.label]);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [item.text]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(item.id, { ...item, [name]: value });
  };

  return (
    <div className="tabbed-textarea">
      {/* only show drag handle if the dragHandleListeners are provided */}
      {dragHandleListeners && <div className="drag-handle" {...dragHandleListeners}>☰</div>}
      <span ref={sizerRef} className="label-sizer">{item.label || 'Label'}</span>
      {isLabelEditable ? (
        <input
          ref={labelRef}
          type="text"
          name="label"
          className="tab-label"
          placeholder="Label"
          value={item.label}
          onChange={handleInputChange}
          disabled={isLocked}
        />
      ) : (
        <span ref={labelRef} className="tab-label static-label">{item.label}</span>
      )}
      <textarea
        ref={textareaRef}
        name="text"
        className="tab-textarea-input"
        placeholder="Description..."
        value={item.text}
        onChange={handleInputChange}
        disabled={isLocked}
      />
      {onUse && (
        <button 
          className={`use-ability-btn ${isUsed ? 'used' : ''}`}
          onClick={() => onUse(item.id)}
          disabled={isUsed}
        >
          {isUsed ? 'Used' : 'Use'}
        </button>
      )}
    </div>
  );
};

export default TabbedTextarea;
