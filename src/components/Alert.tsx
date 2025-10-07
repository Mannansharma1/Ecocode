import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Alert = ({ children, variant = 'info', className = '' }: AlertProps) => {
  const variants = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-800',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: Info,
    },
  };

  const { bg, text, icon: Icon } = variants[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bg} ${className}`}>
      <Icon className={`w-5 h-5 ${text} flex-shrink-0 mt-0.5`} />
      <div className={`${text} text-sm flex-1`}>{children}</div>
    </div>
  );
};
