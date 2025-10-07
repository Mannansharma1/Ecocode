import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 hover:scale-105';

  const variants = {
    primary: 'bg-gradient-to-r from-[#7FC8A9] to-[#326B5D] text-white hover:shadow-lg',
    secondary: 'bg-[#C7E8CA] text-[#326B5D] hover:bg-[#7FC8A9]',
    outline: 'border-2 border-[#7FC8A9] text-[#326B5D] hover:bg-[#C7E8CA]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
