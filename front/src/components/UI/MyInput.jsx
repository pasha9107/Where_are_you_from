import React from 'react';

const MyInput = ({ value, onChange, placeholder, type = "text", ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
      style={{
        padding: '8px 12px',
        borderRadius: 4,
        border: '1px solid #ccc',
        fontSize: 16,
        outline: 'none',
        width: '100%',
        height: '50px',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default MyInput;
