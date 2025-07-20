import React from 'react';

const MyButton = ({ children, onClick, type = "button", style = {}, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      style={{
        backgroundColor: '#ABABAB',
        color: 'black',
        border: 'none',
        borderRadius: 4,
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: 16,
        transition: 'background-color 0.3s',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8A8A8A')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ABABAB')}
    >
      {children}
    </button>
  );
};

export default MyButton;
