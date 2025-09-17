import React from 'react';

const UpflyoverLogo = ({ size = 40, color = 'white', showText = true, variant = 'default' }) => {
  const greenColor = 'rgb(30, 86, 86)';
  const isLight = variant === 'light';
  
  return (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        style={{ marginRight: showText ? '8px' : '0' }}
      >
        <path
          d="M100 20 L180 160 L20 160 Z"
          fill={isLight ? greenColor : color}
        />
        <path
          d="M100 20 L140 90 L60 90 Z"
          fill={isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'}
        />
        <polygon
          points="100,70 120,110 80,110"
          fill={isLight ? '#FFFFFF' : color}
        />
      </svg>
      {showText && (
        <span style={{ 
          fontSize: size * 0.6, 
          fontWeight: 'bold', 
          color: isLight ? greenColor : color,
          letterSpacing: '0.5px'
        }}>
          Upflyover
        </span>
      )}
    </div>
  );
};

export default UpflyoverLogo;