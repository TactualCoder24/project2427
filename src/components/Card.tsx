import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphism?: boolean;
  variant?: 'default' | 'gradient' | 'premium' | 'bordered' | 'dark';
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
      ? 'bg-ink/5 backdrop-blur-sm border border-edge'
      : 'bg-surface-3 border border-edge',
    gradient: 'glass-gradient border-gradient',
    premium: 'glass-premium shadow-glow-sm',
    bordered: 'bg-surface-3 border-2 border-gradient-animate',
    dark: 'bg-surface-3/60 border border-edge hover:border-edge-2 hover:bg-surface-3/90 transition-all duration-300',
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


