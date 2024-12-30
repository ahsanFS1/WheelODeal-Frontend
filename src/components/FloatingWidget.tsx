import React from 'react';

const FloatingWidget = ({ 
  text, 
  link, 
  gradientStart = '#C33AFF', 
  gradientEnd = '#7B1FA2',
  enabled = true,
  position = { side: 'right', offset: 0, topOffset: 50 }
}) => {
  if (!enabled) return null;

  const positionStyles = {
    [position.side]: `${position.offset}px`,
    top: `${position.topOffset}%`,
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed -translate-y-1/2 z-50 transform transition-transform hover:scale-105 duration-300
        ${position.side === 'right' ? 'hover:translate-x-0 translate-x-1' : 'hover:translate-x-0 -translate-x-1'}`}
      style={positionStyles}
    >
      <div 
        className={`flex items-center justify-center px-6 py-4 shadow-lg cursor-pointer
          ${position.side === 'right' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
        style={{
          background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
          minWidth: '160px',
        }}
      >
        <span className="text-white font-medium text-sm whitespace-nowrap">
          {text}
        </span>
      </div>
    </a>
  );
};

export default FloatingWidget;