// src/components/CardComponent.js
import React from 'react';

const CardComponent = ({ components }) => {
  return (
    <div className="relative w-full h-80 bg-white rounded-xl shadow-lg overflow-hidden p-4">
      {components.map((component, index) => (
        <div key={index} style={{
          position: 'absolute',
          top: `${component.y}%`,
          left: `${component.x}%`,
          fontSize: `${component.fontSize}px`,
          color: component.color,
        }}>
          {component.content}
        </div>
      ))}
    </div>
  );
};

export default CardComponent;
