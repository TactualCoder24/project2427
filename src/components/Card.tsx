import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphism?: boolean;
  variant?: 'default' | 'gradient' | 'premium' | 'bordered';
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glassmorphism = false,
  variant = 'default',
  style,
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';

  const hoverClasses = hover
    ? 'hover:transform hover:-translate-y-1 hover:shadow-glow-md'
    : '';

  const variantClasses = {
    default: glassmorphism
      ? 'bg-white/5 backdrop-blur-sm border border-white/10'
      : 'bg-dark-gray border border-medium-gray',
    gradient: 'glass-gradient border-gradient',
    premium: 'glass-premium shadow-glow-sm',
    bordered: 'bg-dark-gray border-2 border-gradient-animate',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
