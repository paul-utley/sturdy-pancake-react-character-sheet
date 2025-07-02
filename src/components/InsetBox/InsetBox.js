import React from 'react';
import './InsetBox.css';

const InsetBox = ({ children }) => {
  return (
    <div className="inset-box">
      <div className="inset-box-content">
        {children}
      </div>
    </div>
  );
};

export default InsetBox;
