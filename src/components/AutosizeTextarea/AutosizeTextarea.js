import React, { useRef, useLayoutEffect } from 'react';
import './AutosizeTextarea.css';

const AutosizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Temporarily shrink to allow for accurate scrollHeight measurement
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="autosize-textarea"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows="1"
    />
  );
};

export default AutosizeTextarea;
