import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'gradient-purple' | 'gradient-pink';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  icon,
}) => {
  const baseClasses = 'font-sora font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-neon-blue to-cyber-aqua text-black hover:shadow-glow-md hover:scale-105 transform',
    secondary: 'bg-gradient-to-r from-neon-green to-lime-green text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] hover:scale-105 transform',
    outline: 'border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black hover:shadow-glow-md hover:scale-105 transform bg-black/20 backdrop-blur-sm',
    gradient: 'bg-gradient-to-r from-cyber-aqua via-vivid-purple to-hot-pink text-white hover:shadow-glow-purple hover:scale-105 transform animate-gradient-shift bg-[length:200%_200%]',
    'gradient-purple': 'bg-gradient-to-r from-vivid-purple to-hot-pink text-white hover:shadow-glow-purple hover:scale-105 transform',
    'gradient-pink': 'bg-gradient-to-r from-hot-pink to-amber-glow text-white hover:shadow-glow-pink hover:scale-105 transform',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;


