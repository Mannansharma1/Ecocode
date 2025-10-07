import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-6 ${
        hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
