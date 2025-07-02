import React, { useRef, useLayoutEffect } from 'react';
import './TabbedTextarea.css';

const TabbedTextarea = ({ item, onChange, isLabelEditable = true }) => {
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
      />
    </div>
  );
};

export default TabbedTextarea;
