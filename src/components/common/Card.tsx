import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  hoverable = false 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-card p-5 ${
        hoverable ? 'transition-shadow hover:shadow-elevated' : ''
      } ${className}`}
    >
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;